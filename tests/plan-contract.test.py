"""Meaningful negative cases for the plan gate; never accesses network or D1."""
from pathlib import Path
import json
import shutil
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from plan_contract import validate, MASTER, TRACE


class PlanContractTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in [MASTER, TRACE, *[f'docs/creator-master/part-{i:02d}-of-12.md' for i in range(1,13)]]:
            dest = self.root / name
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / name, dest)
        data = self.data()
        for row in data['features']:
            for name in row['implementation'] + row['test_candidates']:
                dest = self.root / name
                if not dest.exists():
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(ROOT / name, dest)

    def data(self):
        return json.loads((self.root / TRACE).read_text())

    def write_data(self, data):
        (self.root / TRACE).write_text(json.dumps(data))

    def test_valid_contract_does_not_certify_functionality(self):
        report = validate(self.root)
        self.assertEqual(report['feature_count'], 396)
        self.assertEqual(report['functional_acceptance'], 'NOT_CERTIFIED')

    def test_missing_split_chapter_fails(self):
        (self.root / 'docs/creator-master/part-12-of-12.md').unlink()
        with self.assertRaisesRegex(ValueError, 'Missing or empty'): validate(self.root)

    def test_unlinked_split_chapter_fails(self):
        p=self.root/MASTER;p.write_text(p.read_text().replace('creator-master/part-12-of-12.md','missing.md'))
        with self.assertRaisesRegex(ValueError,'does not link'):validate(self.root)

    def test_two_current_states_fail(self):
        p=self.root/MASTER;p.write_text(p.read_text()+'\n## AKTUÁLIS VÉGREHAJTÁSI ÁLLAPOT — duplicate\n')
        with self.assertRaisesRegex(ValueError,'Multiple'):validate(self.root)

    def test_stale_historical_cursor_cannot_be_current(self):
        p=self.root/MASTER;p.write_text(p.read_text().replace('**Egyetlen következő blokk:** `77.44.7.A`','**Egyetlen következő blokk:** `63.50.92`',1))
        with self.assertRaisesRegex(ValueError,'outside'):validate(self.root)

    def test_nonexistent_next_block_fails(self):
        p=self.root/MASTER;p.write_text(p.read_text().replace('**Egyetlen következő blokk:** `77.44.7.A`','**Egyetlen következő blokk:** `77.44.7.Z`',1))
        with self.assertRaisesRegex(ValueError,'declared OPEN'):validate(self.root)

    def test_duplicate_catalog_id_fails(self):
        p=self.root/'docs/creator-master/part-01-of-12.md';p.write_text(p.read_text().replace('- ADM-002:','- ADM-001:',1))
        with self.assertRaisesRegex(ValueError,'396 unique'):validate(self.root)

    def test_missing_or_duplicate_mapping_fails(self):
        for duplicate in (False,True):
            data=self.data()
            if duplicate:data['features'][-1]=data['features'][0]
            else:data['features'].pop()
            self.write_data(data)
            with self.assertRaisesRegex(ValueError,'each of the 396'):validate(self.root)
            shutil.copyfile(ROOT/TRACE,self.root/TRACE)

    def test_stale_title_fails(self):
        data=self.data();data['features'][0]['title']='stale';self.write_data(data)
        with self.assertRaisesRegex(ValueError,'Stale traceability'):validate(self.root)

    def test_missing_implementation_fails(self):
        data=self.data();name=data['features'][0]['implementation'][0];(self.root/name).unlink()
        with self.assertRaisesRegex(ValueError,'Missing implementation'):validate(self.root)

    def test_changed_source_requires_mapping_review(self):
        data=self.data();path=self.root/data['features'][0]['implementation'][0];path.write_text('changed source')
        with self.assertRaisesRegex(ValueError,'Stale source fingerprint'):validate(self.root)

    def test_wrong_contract_line_fails(self):
        data=self.data();data['features'][0]['contract_source']['line']=1;self.write_data(data)
        with self.assertRaisesRegex(ValueError,'Contract source mismatch'):validate(self.root)

    def test_inventory_must_not_forge_acceptance_or_completion(self):
        for field,value in [('acceptance','PASS'),('source_status','COMPLETE')]:
            data=self.data();data['features'][0][field]=value;self.write_data(data)
            with self.assertRaises(ValueError):validate(self.root)
            shutil.copyfile(ROOT/TRACE,self.root/TRACE)


if __name__ == '__main__': unittest.main()
