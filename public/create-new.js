const addAnotherWordButt = document.getElementById('add-another-word-butt');
const table = document.getElementById('new-word-table');
const editButt = document.getElementById('edit-study-butt');

addAnotherWordButt.addEventListener('click', () => {
  const newRow = document.createElement('tr');
  const newWord = document.createElement('td');
  const newDef = document.createElement('td');
  const kanjiInput = document.createElement('input');
  const yomikataInput = document.createElement('input');
  kanjiInput.type = 'text';
  yomikataInput.type = 'text';
  kanjiInput.name = 'kanji-input';
  yomikataInput.name = 'yomikata-input';
  kanjiInput.id = 'kanji-input';
  yomikataInput.id = 'yomikata-input';
  kanjiInput.required = true;
  yomikataInput.required = true;
  newWord.appendChild(kanjiInput);
  newDef.appendChild(yomikataInput);
  newRow.appendChild(newWord);
  newRow.appendChild(newDef);
  table.appendChild(newRow);
});

editButt.addEventListener('click', () => {
  console.log('edit butt clicked');
  getStudySets();
});

async function getStudySets() {
  const res = await fetch('/add_words/get_set');
  const data = await res.json();
  const sets = data.sets;
  console.log(sets);
}
