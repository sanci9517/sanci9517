import {
  normalizeInspectorValue, getInspectorValueContract, INSPECTOR_FONTS, INSPECTOR_SHADOWS
} from '../core/property-values.js';
import {TOKEN_SPECS,compatibleTokens,parseTokenReference,tokenReference,tokenValue,defaultTokens} from '../core/design-tokens.js';
import {mediaAssetPicker} from './element-content-controls.js?v=20261029-media-picker-a11y';

/** One property input. All changes go through the central command callback. */
export function renderPropertyInput(property, label, current, onChange, {
  tokens=defaultTokens(), command=property.command, key=property.key
}={}) {
  const binding=parseTokenReference(current),availableTokens=compatibleTokens(property);
  if(binding)current=tokenValue(tokens,binding);
  const wrap = document.createElement('div');
  wrap.className = 'field typed-inspector-field';
  wrap.dataset.propertyId = property.id;
  if(command)wrap.dataset.propertyCommand=command;
  if(key)wrap.dataset.propertyKey=key;
  const heading = document.createElement('div');
  heading.className = 'property-heading';
  const title = document.createElement('label');
  title.textContent = label;
  const controlId = 'prop-' + property.id.replaceAll('.', '-') + '-' + Math.random().toString(36).slice(2, 7);
  title.id=controlId+'-label';
  title.htmlFor = controlId;
  const contract=getInspectorValueContract(property);
  const error = document.createElement('small');
  error.className = 'property-validation';
  error.id=controlId+'-validation';
  error.setAttribute('role', 'status');
  error.setAttribute('aria-live', 'polite');
  const validationControls=[];
  const associateValidation=control=>{
    control.setAttribute('aria-describedby',error.id);
    control.setAttribute('aria-required',String(contract.required===true));
    control.setAttribute('aria-invalid','false');
    validationControls.push(control);
    return control;
  };
  const save = raw => {
    try {
      const value = normalizeInspectorValue(property, raw);
      if(onChange(value)===false)throw new Error('A módosítás nem alkalmazható.');
      error.textContent = '';
      for(const control of validationControls)control.setAttribute('aria-invalid','false');
      return true;
    } catch (e) {
      error.textContent = e instanceof Error ? e.message : 'Érvénytelen érték';
      for(const control of validationControls)control.setAttribute('aria-invalid','true');
      return false;
    }
  };
  const info = document.createElement('button');
  info.type = 'button';
  info.className = 'property-info-toggle';
  info.textContent = 'i';
  info.setAttribute('aria-label', label + ' magyarázata');
  info.setAttribute('aria-expanded', 'false');
  info.setAttribute('aria-controls',controlId+'-help');
  const help = document.createElement('small');
  help.className = 'property-help';
  help.id=controlId+'-help';
  help.hidden = true;
  help.textContent = property.help || describeProperty(property);
  info.onclick = () => {
    help.hidden = !help.hidden;
    info.setAttribute('aria-expanded', String(!help.hidden));
  };
  heading.append(title, info);
  wrap.append(heading, help);
  let tokenPicker=null;
  let commitColorPreset=null;
  if(availableTokens.length){
    const picker=associateValidation(document.createElement('select'));picker.className='property-token-picker';picker.setAttribute('aria-label',label+' közös stílusa');
    for(const [value,text] of [['','Egyedi érték'],...availableTokens.map(id=>[id,TOKEN_SPECS[id].label])]){const option=document.createElement('option');option.value=value;option.textContent=text;picker.append(option)}
    picker.value=binding||'';picker.onchange=()=>save(picker.value?tokenReference(picker.value):current);tokenPicker=picker;
    if(binding){const note=document.createElement('small');note.className='content-field-help';note.textContent='A Brand Kit közös értékét követi. Egyedi értékre váltva leválaszthatod.';wrap.append(note)}
  }
  const type = property.type;
  if (type === 'asset') {
    title.removeAttribute('for');
    const picker=mediaAssetPicker(current==='none'?'':current||'',id=>save(id||'none'),{
      disabled:Boolean(property.disabled),ariaLabelledBy:title.id,ariaDescribedBy:error.id
    });
    const open=picker.querySelector('button[aria-controls]');
    if(open)associateValidation(open);
    wrap.append(picker);
    wrap.append(error);
    return wrap;
  }
  if (type === 'select' || type === 'font' || type === 'shadow') {
    const select = associateValidation(document.createElement('select'));
    select.id = controlId;
    const choices = type === 'font' ? INSPECTOR_FONTS : type === 'shadow' ? INSPECTOR_SHADOWS : property.options;
    for (const value of ['', ...choices]) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value ? property.optionLabels?.[value] || property.presets?.find(preset=>preset.value===value)?.label || value : '— Válassz —';
      select.append(option);
    }
    if (current && !choices.includes(String(current))) {
      const custom = document.createElement('option');
      custom.value = current;
      custom.textContent = 'Jelenlegi egyedi érték';
      select.append(custom);
    }
    select.value = current || '';
    select.onchange = () => save(select.value);
    wrap.append(select);
  } else if (type === 'color') {
    const controls = document.createElement('div');
    controls.className = 'typed-color-controls';
    const picker = associateValidation(document.createElement('input'));
    picker.type = 'color';
    picker.id = controlId;
    picker.setAttribute('aria-label', label + ' színválasztó');
    const hex = associateValidation(document.createElement('input'));
    hex.type = 'text';
    hex.value = current || '';
    hex.placeholder = '#RRGGBB vagy transparent';
    hex.setAttribute('aria-label', label + ' HEX');
    const indicator=document.createElement('small');
    indicator.className='typed-color-status';
    indicator.setAttribute('role','status');
    // Native input[type=color] only supports opaque RGB. Never claim a
    // transparent/alpha color matches the fallback swatch.
    const pickerRgb=value=>{
      const text=String(value??'');
      if(/^#[0-9a-f]{3}$/i.test(text))
        return '#'+[...text.slice(1)].map(char=>char+char).join('');
      if(/^#[0-9a-f]{4}$/i.test(text))
        return '#'+[...text.slice(1,4)].map(char=>char+char).join('');
      if(/^#[0-9a-f]{6}$/i.test(text))return text;
      if(/^#[0-9a-f]{8}$/i.test(text))return text.slice(0,7);
      return null;
    };
    const sync=value=>{
      const rgb=pickerRgb(value);
      if(rgb)picker.value=rgb;
      else picker.value='#808080';
      hex.value=value;
      const transparent=String(value).toLowerCase()==='transparent';
      const alpha=/^#[0-9a-f]{4}(?:[0-9a-f]{4})?$/i.test(String(value));
      picker.classList.toggle('color-preview-limited',transparent||alpha);
      indicator.textContent=transparent?'Átlátszó szín – a színválasztó RGB-előnézete nem mérvadó.':
        alpha?'Az átlátszóságot a HEX-mező őrzi; a színválasztó csak RGB-t mutat.':'';
      for(const button of wrap.querySelectorAll('.property-preset-color')){
        button.setAttribute('aria-pressed',String(button.dataset.value===value));
      }
    };
    const commitColor=value=>{
      // Invalid values stay visible with validation feedback. The previous
      // swatch and Page Model value must not change until validation succeeds.
      if(save(value))sync(value);
    };
    picker.onchange=()=>commitColor(picker.value);
    hex.onchange=()=>commitColor(hex.value);
    sync(current||'');
    controls.append(picker,hex);
    wrap.append(controls,indicator);
    // Presets use the same sync pathway as the picker and HEX entry.
    wrap.dataset.colorField='true';
    commitColorPreset=commitColor;
  } else if (type === 'box') {
    // A typed number + unit per side: no CSS syntax needed on mobile.
    // The stored value remains the same four-part CSS shorthand.
    const parts = String(current || '0').trim().split(/\s+/);
    const values = parts.length === 1 ? [parts[0],parts[0],parts[0],parts[0]] :
      parts.length === 2 ? [parts[0],parts[1],parts[0],parts[1]] :
      parts.length === 3 ? [parts[0],parts[1],parts[2],parts[1]] : parts.slice(0,4);
    const grid = document.createElement('div');
    grid.className = 'typed-box-controls';
    const boxUnits = ['px','%','rem','em','vw','vh'];
    const isMargin=property.key==='margin';
    ['Felül','Jobb','Alul','Bal'].forEach((side,i) => {
      const field=document.createElement('div');
      field.className='typed-box-side';
      const sideLabel=document.createElement('strong');
      sideLabel.textContent=side;
      const controls=document.createElement('div');
      controls.className='typed-box-entry';
      const number=associateValidation(document.createElement('input'));
      number.type='number';number.inputMode='decimal';number.step='any';
      if(!isMargin)number.min='0';
      number.setAttribute('aria-label',label+' – '+side+' értéke');
      const unit=associateValidation(document.createElement('select'));
      unit.setAttribute('aria-label',label+' – '+side+' mértékegysége');
      for(const choice of [...boxUnits,...(isMargin?['auto']:[])]) {
        const option=document.createElement('option');
        option.value=choice;option.textContent=choice==='auto'?'Auto':choice;
        unit.append(option);
      }
      const existing=values[i]||'0';
      const parsed=existing.match(/^(-?(?:\d+(?:\.\d+)?|\.\d+))([a-z%]*)$/i);
      const isAuto=existing==='auto'&&isMargin;
      number.value=isAuto?'':parsed?.[1]??'0';
      unit.value=isAuto?'auto':boxUnits.includes(parsed?.[2])?parsed[2]:'px';
      number.disabled=isAuto;
      const commit=()=>{
        if(unit.value==='auto'&&isMargin){values[i]='auto';number.disabled=true;number.value='';}
        else {
          number.disabled=false;
          if(number.value==='')return;
          const numberValue=Number(number.value);
          // Canonical zero is valid with any selected unit.
          values[i]=numberValue===0?'0':number.value+unit.value;
        }
        save(values.join(' '));
      };
      number.onchange=commit;
      number.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();number.blur()}};
      unit.onchange=()=>{
        if(unit.value!=='auto'&&!number.value)number.value='0';
        commit();
      };
      controls.append(number,unit);
      field.append(sideLabel,controls);
      grid.append(field);
    });
    wrap.append(grid);
  } else if (type === 'dimension') {
    const controls=document.createElement('div');controls.className='dimension-controls';
    const contract=getInspectorValueContract(property);
    const match=String(current??'').trim().match(/^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/i);
    const special=String(current??'').trim()==='auto'&&property.units?.includes('auto');
    const number=associateValidation(document.createElement('input'));number.type='number';number.inputMode='decimal';
    number.step=String(contract.step??'any');
    if(Number.isFinite(contract.min))number.min=String(contract.min);
    else if(contract.negative===false)number.min='0';
    if(Number.isFinite(contract.max))number.max=String(contract.max);
    number.value=special?'':match?.[1]??'';number.setAttribute('aria-label',label+' értéke');
    const unit=associateValidation(document.createElement('select'));unit.setAttribute('aria-label',label+' mértékegysége');
    const blank=document.createElement('option');blank.value='';blank.textContent='Egység';unit.append(blank);
    for(const choice of property.units||[]){if(choice==='0')continue;const option=document.createElement('option');option.value=choice;option.textContent=choice==='auto'?'Auto':choice;unit.append(option)}
    if(special)unit.value='auto';
    else if(match){const selected=match[2]||'px';if([...unit.options].some(option=>option.value===selected))unit.value=selected;else unit.value=''}
    else unit.value=(property.units||[]).find(choice=>choice!=='auto'&&choice!=='0')||'';
    number.disabled=special;unit.onchange=()=>{number.disabled=unit.value==='auto';if(unit.value==='auto'){number.value='';save('auto')}else if(number.value)save(number.value+(unit.value||''))};
    number.onchange=()=>{if(number.value&&unit.value&&unit.value!=='auto')save(number.value+unit.value)};
    number.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();number.blur()}};
    controls.append(number,unit);wrap.append(controls);
    const note=document.createElement('small');note.className='property-unit-hint';
    note.textContent='Az egység módosítása megváltoztathatja a tényleges méretet.';wrap.append(note);
  } else {
    const contract=getInspectorValueContract(property);
    if(contract.multiline){
      const textarea=associateValidation(document.createElement('textarea'));
      textarea.id=controlId;textarea.rows=4;textarea.value=current??'';
      textarea.className='typed-inspector-textarea';
      textarea.onchange=()=>save(textarea.value);
      wrap.append(textarea);
    }else{
      const input = associateValidation(document.createElement('input'));
      input.id = controlId;
      input.type = type === 'number' ? 'number' : 'text';
      input.value = current ?? '';
      if(Number.isInteger(contract.maxLength))input.maxLength=contract.maxLength;
      if (type === 'number') {
        if(Number.isFinite(contract.min))input.min=String(contract.min);
        if(Number.isFinite(contract.max))input.max=String(contract.max);
        input.step=String(contract.step??'any');
        // Decimal keyboards generally retain a minus key, which matters for the
        // signed z-index range even though its valid values are whole numbers.
        input.inputMode='decimal';
      }
      input.onchange = () => save(input.value);
      input.onkeydown = event => {if(event.key === 'Enter') {event.preventDefault();input.blur();}};
      wrap.append(input);
    }
  }
  // Choice controls already expose every available option. Repeating the same
  // values as chips makes the Inspector longer without adding a faster choice.
  const choiceControl = ['select', 'font', 'shadow'].includes(type);
  if(property.presets?.length && !choiceControl && !['size.width','size.height'].includes(property.id)){
    const group=document.createElement('div');group.className='property-presets';group.setAttribute('role','group');group.setAttribute('aria-label',label+' gyorsbeállítások');
    for(const preset of property.presets){
      const button=document.createElement('button');button.type='button';button.className='property-preset';
      button.textContent=preset.label;button.dataset.value=preset.value;
      button.setAttribute('aria-pressed',String(String(current??'')===preset.value));
      if(type==='color'){button.classList.add('property-preset-color');button.style.setProperty('--preset-color',preset.value==='transparent'?'transparent':preset.value);button.title=preset.label+' · '+preset.value}
      button.onclick=()=>type==='color'?commitColorPreset(preset.value):save(preset.value);group.append(button);
    }
    wrap.append(group);
  }
  if(tokenPicker)wrap.append(tokenPicker);
  wrap.append(error);
  if(binding)for(const input of wrap.querySelectorAll('input,select:not(.property-token-picker),.property-presets button'))input.disabled=true;
  // A locked node is read-only, including presets and token bindings. Keep the
  // explanation toggle available so its settings remain understandable.
  if(property.disabled)for(const control of wrap.querySelectorAll('input,select,textarea,button:not(.property-info-toggle)'))control.disabled=true;
  return wrap;
}

function describeProperty(property) {
  const help = {
    'content.text':'Ez az elem látható szövege. Írd át a tartalmat anélkül, hogy a betűtípusát vagy a stílusát megváltoztatnád. A Rich Text teljes formázását a Tartalom fülön végezheted.',
    'content.href':'Ide kerül a kattintás célja. Belső oldalnál használj például /p/kezdolap alakot; külső weboldalnál teljes https:// címet. Nem változtatja meg a publikálást.',
    'size.width':'Az elem vízszintes mérete. Az „auto” a tartalomhoz igazodik, a px rögzített méret, a % pedig a szülőelem szélességének aránya. Példa: 320px vagy 100%. Mobilon külön értéket állíthatsz be.',
    'size.height':'Az elem függőleges mérete. Az „auto” a tartalom alapján nő; px rögzített, vh pedig a böngészőablak magasságához igazodik. Hosszabb szövegnél általában az auto ad biztonságos eredményt.',
    'size.minWidth':'Az elem legkisebb szélessége. Megakadályozza, hogy a tartalom túl keskenyre zsugorodjon; például egy gombnál vagy kártyánál hasznos.',
    'size.maxWidth':'Az elem legnagyobb szélessége. A 100% mobilon a szülőnél nem engedi szélesebbre nőni; 720px körüli korlát hosszabb szövegnél olvashatóbb sort adhat.',
    'size.minHeight':'Az elem legkisebb magassága. Rövid tartalom esetén is megtartja a kívánt térközt; a tartalom ettől még növelheti a magasságot.',
    'size.maxHeight':'Az elem legnagyobb magassága. Korlátozza a növekedést; ha a tartalom hosszabb, ellenőrizd a Túlcsordulás beállítást is.',
    'spacing.margin':'Az elem körüli külső távolság. A felső, jobb, alsó és bal érték külön állítható. Példa: 16px minden oldalon vagy 0 auto vízszintes középre igazításhoz.',
    'spacing.padding':'Az elem keretén belüli távolság, a tartalom és a szél között. Nagyobb érték tágasabb kártyát vagy gombot ad. A negatív belső térköz nem engedélyezett.',
    'layout.display':'Az elem és gyermekei elrendezését választja ki. A Blokk egymás alá helyez, a Flex egy sorba vagy oszlopba rendez, a Rács sorokra és oszlopokra oszt. A gyermekek igazítása ezek után állítható.',
    'layout.overflow':'Azt szabályozza, mi történjen, ha a tartalom túlnyúlik az elemen. A Látható megőrzi, a Levágás elrejti a kilógó részt, a Görgethető belső görgetést adhat.',
    'position.position':'A Normál folyás a dokumentum rendes helyén hagyja az elemet. A Mozgatható relatív eltolást enged; a Réteg kivonja a normál elrendezésből; a Ragadós görgetéskor egy határnál megáll. A Réteg és Ragadós beállításnál ellenőrizd mobilon is az átfedést.',
    'position.x':'Vízszintes eltolás a normál helyéről. Pozitív érték jobbra, negatív balra mozgat. Ha az elem a fehér oldal szélén kívülre kerül, a szerkesztő munkaterülete követi, hogy vissza tudd hozni.',
    'position.y':'Függőleges eltolás a normál helyéről. Pozitív érték lefelé, negatív felfelé mozgat. A szülőelemhez képest értelmeződik; ellenőrizd a többi eszköznézetet is.',
    'position.zIndex':'Az egymást fedő elemek sorrendje. Magasabb szám az elem elé helyezi az alacsonyabb számúakat. Két elem csak megfelelő pozicionálás mellett hasonlítható össze.',
    'typography.fontFamily':'A szöveg betűcsaládja. A rendszerbetű gyorsan betölt, a Georgia vagy monospace karakteresebb hangulatú. A betűk végső alakja az olvasó eszközén enyhén eltérhet.',
    'typography.fontSize':'A betű mérete. px rögzített, rem a webhely alap betűméretéhez, vw a képernyő szélességéhez igazodik. Példák: 16px törzsszöveghez, 32px címhez. Telefonon ellenőrizd az olvashatóságot.',
    'typography.fontWeight':'A betű vastagsága: 300 vékony, 400 normál, 600 félkövér, 700 erős. Ha egy betűcsalád nem tartalmazza a kért súlyt, a böngésző közeli változatot jeleníthet meg.',
    'typography.fontStyle':'A Normál egyenes, a Dőlt megdöntött betűket használ. Rövid kiemeléshez vagy idézethez hasznos; nagy szövegrészen csökkentheti az olvashatóságot.',
    'typography.lineHeight':'A sorok közötti függőleges távolság aránya. 1.4–1.6 általában kényelmes törzsszöveghez, kisebb érték tömör címhez illik.',
    'typography.letterSpacing':'A betűk közötti távolság. Kis pozitív érték levegősebb címet, negatív érték szorosabb megjelenést ad. Törzsszövegnél maradj visszafogott.',
    'typography.wordSpacing':'A szavak közötti távolságot növeli vagy csökkenti az alap betűközön felül. A 0 az alapérték; például 2px levegősebb mondatot ad. Túl nagy vagy negatív értéknél telefonon nehezebbé válhat az olvasás.',
    'typography.textIndent':'A bekezdés első sorának behúzása. Például 1em egy betűméretnyi beljebb kezdést ad; negatív értéknél az első sor kilóghat. Nem helyettesíti az egész elem belső térközét.',
    'typography.textAlign':'A szöveg vízszintes igazítása az elemben. A Sorkizárt mindkét szélt kiegyenlíti, ami keskeny telefonos oszlopban nagy hézagokat okozhat.',
    'typography.textTransform':'A megjelenített betűk kis- és nagybetűs alakja. Nem írja át az eredeti tartalmat: a Nagybetűs például vizuálisan nagybetűt mutat, miközben a mentett szöveg változatlan.',
    'typography.textDecoration':'Vizuális vonalat ad a szöveghez: aláhúzás, áthúzás vagy felső vonal. A link aláhúzását ne rejtsd el, ha ez az egyetlen jelzi, hogy kattintható.',
    'background.color':'Az elem háttérszíne. A színválasztó vagy HEX-kód ugyanazt az értéket állítja; az áttetsző opciónál a mögöttes szín látszik. A kontrasztot a szöveggel együtt ellenőrizd.',
    'background.image':'A webhely Médiatárából választhatsz dekoratív háttérképet. A kép csak külön Publish után jelenik meg a publikus oldalon.',
    'border.width':'A keret vastagsága. A 0 eltünteti, 1px finom elválasztó, 2px vagy több hangsúlyosabb szegély. A stílushoz és színhez a Szegély csoport tartozik.',
    'border.style':'A keret vonalának formája. Folytonos a szokásos keret; szaggatott vagy pontozott vonal inkább szerkesztői vagy különleges jelölésre való.',
    'border.color':'A keret színe. A szöveghez és háttérhez képest legyen jól látható, de ne versenyezzen a tartalommal.',
    'radius.all':'Mind a négy sarkot egyszerre kerekíti. 8–16px jellemző kártyához; a 999px pill alakot ad. A sarokcsoport külön mezőivel az egyes sarkok eltérhetnek.',
    'radius.topLeft':'Csak a bal felső sarkot kerekíti. A négy külön sarokmezővel egyedi keretformát készíthetsz, például egy oldalon erősebben lekerekített kártyát. Ha a Lekerekítés mező is kapott értéket, ez az egyedi sarok azt felülírja.',
    'radius.topRight':'Csak a jobb felső sarkot kerekíti. Nézd meg, hogy összhangban marad-e a többi sarokkal; a teljes Lekerekítés alapértékét ez az egyedi érték felülírja.',
    'radius.bottomRight':'Csak a jobb alsó sarkot kerekíti. A teljes Lekerekítés mező alapértéke felülírható ezzel az egyedi értékkel, így egyedi kártyaformát készíthetsz.',
    'radius.bottomLeft':'Csak a bal alsó sarkot kerekíti. A teljes Lekerekítés mező alapértéke felülírható ezzel az egyedi értékkel; ellenőrizd az összes nézetben az eredményt.',
    'shadow.box':'Az elem mögötti árnyékot választja ki. A nagyobb, sötétebb árnyék jobban kiemel, de zsúfolt felületen elvonhatja a figyelmet.',
    'opacity.value':'Az elem és tartalma átlátszósága 0 és 1 között. 1 teljesen látható, 0 teljesen átlátszó. Az egész elemet halványítja, a gyermekeket is.',
    'flex.direction':'A Flex gyermekek sorrendjének iránya. Sorban egymás mellé, oszlopban egymás alá rendez. A fordított opciók megfordítják a vizuális irányt.',
    'flex.justify':'A gyermekeket a fő irány mentén rendezi el. A space-between a szélső elemeket a két szélhez tolja, a center középre helyez.',
    'flex.align':'A gyermekek keresztirányú igazítása. A stretch kitölti a rendelkezésre álló helyet; a center középre, a baseline a szöveg alapvonalára igazít.',
    'flex.wrap':'Ha nincs elég hely, az elemek új sorba törjenek-e. A wrap mobil nézetben gyakran jobb, mint a zsugorítás.',
    'flex.gap':'Az elrendezett gyermekek közötti távolság. Nem ad plusz teret a konténer külső széléhez; arra a Belső térköz mező való.',
    'flex.grow':'Azt szabályozza, mennyire vegyen fel szabad helyet a gyermek a Flex konténerben. 0 nem növekszik, 1 a többi 1-es gyermekkel egyenlően osztozik.',
    'flex.shrink':'Azt szabályozza, mennyire zsugorodhat a gyermek, ha kevés a hely. 0 megtartja a méretet és kilóghat; 1 engedi a zsugorodást.',
    'flex.basis':'A Flex gyermek kiinduló mérete a növekedés és zsugorodás előtt. Auto a saját méretéből indul, százalék a konténerhez viszonyít.',
    'flex.alignSelf':'Csak ezt az egy gyermeket igazítja felül a szülő közös Elem igazítása beállításához képest. Használd például egy kiemelt gomb középre helyezésére úgy, hogy a többi elem helye ne változzon.',
    'grid.columns':'A Grid oszlopainak száma és szélessége. A 2 oszlopos preset egyenlő oszlopokat készít; mobilon válassz külön egyszerűbb kiosztást.',
    'grid.rows':'A Grid sorainak méretezése. Az Auto a tartalomhoz igazodik, az 1fr a szabad hely arányos részét foglalja el.',
    'grid.column':'A gyermek helye az oszloprácsban: az 1–4 érték az adott oszlopba teszi. Az „1 / -1” a teljes rácsszélességen átível; a pozíció az aktuális reszponzív nézet sajátja.',
    'grid.row':'A gyermek helye a sorrácsban: az 1–4 érték az adott sorba teszi. Az „1 / -1” az összes soron átível; ütköző elemek egymást fedhetik, ezért ellenőrizd az előnézetet.',
    'grid.rowGap':'A Grid sorai közötti távolság, px/rem/em vagy százalék formájában. Ez csak függőleges közöket ad; az oszlopok közötti távolságot külön, az Oszlopköz mező szabályozza.',
    'grid.columnGap':'A Grid oszlopai közötti vízszintes távolság, px/rem/em vagy százalék formájában. A sorok közötti távolságot külön, a Sorköz mező szabályozza.',
    'advanced.nodeName':'Belső technikai név a vászon réteglistájában. Az olvasó által látott szöveget a Tartalom mezőben módosítsd.'
  };
  return help[property.id] || `${property.label || 'Ez a beállítás'} a kijelölt elem megjelenését szabályozza. A változás az aktuális nézetben látszik; tablet- és mobilnézetben külön értéket is megadhatsz. Próbáld ki, majd ellenőrizd az előnézetben és mentés után a publikált oldalon.`;
}
