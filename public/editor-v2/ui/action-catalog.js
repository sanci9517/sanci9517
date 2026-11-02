import {EDITOR_ICON_NAMES} from './action-icons.js?v=20261102-workspace-preferences-v2';

export const EDITOR_ACTIONS=Object.freeze({
  openLeftPanel:{icon:'panel-left-open',label:'Oldal- és eszközpanel megnyitása',description:'Nyisd meg az oldalak, építőelemek, rétegek, adásrend és navigáció paneljét.'},
  newPage:{icon:'file-plus',label:'Új oldal',description:'Hozz létre egy új, még nem publikált oldalt a webhelyen.'},
  undo:{icon:'undo-2',label:'Visszavonás',description:'Vond vissza az utolsó szerkesztési lépést. A korábbi lépések továbbra is elérhetők az Újra művelettel.'},
  redo:{icon:'redo-2',label:'Újra',description:'Állítsd vissza az utoljára visszavont szerkesztési lépést, hogy folytathasd a munkát.'},
  preview:{icon:'eye',label:'Előnézet',description:'Nézd meg az oldalt látogatói nézetben. Az előnézet nem ment és nem publikál.'},
  saveDraft:{icon:'save',label:'Mentés',description:'Mentsd el a módosításokat piszkozatként. A látogatók által látható oldal nem változik.'},
  publishDraft:{icon:'cloud-upload',label:'Publikálás',description:'Tedd a mentett piszkozatot közzé, vagyis tedd láthatóvá a webhely látogatói számára. Ez külön lépés a Mentéstől.'},
  unpublishPage:{icon:'globe',label:'Publikálás visszavonása',description:'Vedd le ezt az oldalt a látogatók elől; a mentett piszkozat megmarad.'},
  moreActions:{icon:'ellipsis',label:'További szerkesztőműveletek',description:'Nyisd meg a ritkábban használt szerkesztőműveleteket és kapcsolatállapotot.'},
  workspaceAppearance:{icon:'sliders-horizontal',label:'Megjelenés és munkaterület',description:'Állítsd be a szerkesztő színeit, sűrűségét és panel-elrendezését ezen az eszközön; a weboldal tartalma nem változik.'},
  twitchConnection:{icon:'radio',label:'Twitch-kapcsolat',description:'Ellenőrizd vagy kezeld a Twitch kapcsolatot. A kapcsolat állapota önmagában nem menti vagy publikálja az oldalt.'},
  openRightPanel:{icon:'panel-right-open',label:'Beállítások megnyitása',description:'Nyisd meg a kijelölt elem szövegének, kinézetének és egyéb beállításainak paneljét.'},
  pages:{icon:'files',label:'Oldalak',description:'Válassz oldalt, rendezd a webhely oldalait, vagy nyisd meg egy korábbi mentés előzményeit.'},
  elements:{icon:'shapes',label:'Elemek',description:'Keress és adj hozzá építőelemeket, például címsort, képet, szöveget vagy gombot.'},
  layers:{icon:'layers-2',label:'Rétegek',description:'Lásd az oldal elemeit szülő–gyermek fa nézetben; itt kijelölhetsz és átrendezhetsz elemeket.'},
  schedule:{icon:'calendar-days',label:'Adásrend',description:'Válaszd ki az oldal Adásrend elemét; annak részleteit a jobb oldali beállításoknál módosíthatod.'},
  navigation:{icon:'route',label:'Navigáció',description:'Szerkeszd a látogatóknak látható menü piszkozatát. Mentése még nem teszi közzé a menüt.'},
  closeLeftPanel:{icon:'panel-left-close',label:'Oldalpanel bezárása',description:'Csukd össze az oldal- és eszközpanelt; az oldal tartalma és kijelölése változatlan marad.'},
  closeRightPanel:{icon:'panel-right-close',label:'Beállítások bezárása',description:'Csukd össze a jobb oldali beállítások panelt; az oldal tartalma és kijelölése változatlan marad.'},
  selectTool:{icon:'mouse-pointer-2',label:'Kijelölés',description:'Válaszd ki vagy szerkeszd a vásznon látható elemeket.'},
  panTool:{icon:'hand',label:'Vászon mozgatása',description:'Mozgasd a nagyítva megjelenített vásznat anélkül, hogy elemet jelölnél ki vagy módosítanál.'},
  deviceDesktop:{icon:'monitor',label:'Asztali előnézet',description:'Mutasd meg az oldal széles, asztali képernyőre tervezett változatát.'},
  deviceTablet:{icon:'tablet',label:'Tablet előnézet',description:'Mutasd meg, hogyan igazodik az oldal egy tablet méretű képernyőhöz.'},
  deviceMobile:{icon:'smartphone',label:'Telefonos előnézet',description:'Mutasd meg az oldal keskeny, telefonos képernyőre tervezett változatát.'},
  fitCanvas:{icon:'maximize',label:'Vászon igazítása',description:'Nagyíts vagy kicsinyíts úgy, hogy a teljes oldal kényelmesen elférjen a munkaterületen.'},
  zoomOut:{icon:'zoom-out',label:'Kicsinyítés',description:'Kicsinyítsd a vászon nézetét. Ez csak a szerkesztő nagyítását változtatja meg.'},
  zoomIn:{icon:'zoom-in',label:'Nagyítás',description:'Nagyítsd a vászon nézetét. Ez csak a szerkesztő nagyítását változtatja meg.'},
  groupSelection:{icon:'combine',label:'Kijelölt elemek csoportosítása',description:'Fogd össze a kijelölt elemeket, hogy együtt mozgathasd és rendezhessed őket.'},
  ungroupSelection:{icon:'ungroup',label:'Csoport felbontása',description:'Bontsd fel a kijelölt csoportot; az elemei külön szerkeszthetők maradnak.'},
  moveLayerUp:{icon:'arrow-up',label:'Réteg előrébb mozgatása',description:'Helyezd a kijelölt elemet egy szinttel feljebb az oldal rétegsorrendjében.'},
  moveLayerDown:{icon:'arrow-down',label:'Réteg hátrébb mozgatása',description:'Helyezd a kijelölt elemet egy szinttel lejjebb az oldal rétegsorrendjében.'},
  indentLayer:{icon:'corner-down-left',label:'Réteg csoportba rendezése',description:'Helyezd a kijelölt elemet az előtte álló befoglaló elem belsejébe.'},
  outdentLayer:{icon:'corner-up-right',label:'Réteg kiemelése a csoportból',description:'Vedd ki a kijelölt elemet a szülőcsoportjából, és helyezd mellé.'},
});

export function validateEditorActionCatalog(actions=EDITOR_ACTIONS,iconNames=EDITOR_ICON_NAMES){
  const icons=new Set(iconNames);
  const seen=new Map();
  const errors=[];
  for(const [actionId,action] of Object.entries(actions)){
    if(!action?.label?.trim()||!action?.description?.trim())errors.push(`${actionId}: missing plain-language label or description`);
    if(!icons.has(action.icon))errors.push(`${actionId}: unknown icon ${action.icon}`);
    const previous=seen.get(action.icon);
    if(previous)errors.push(`${actionId}: icon ${action.icon} is already assigned to ${previous}`);
    else seen.set(action.icon,actionId);
  }
  return errors;
}
