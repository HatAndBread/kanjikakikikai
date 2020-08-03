const setEditButts = document.getElementsByClassName('main-button set-edit-butt');
const setEditor = document.getElementById('set-editor');
const setTitle = document.getElementById('set-title');
const table = document.getElementById('edit-table');
const addWordButt = document.getElementById('add-word-butt');
const saveChangesButt = document.getElementById('save-changes-butt');
/*=============
    ==============*/
const currentSet = {};
const ids = [];
const tableRowGarbage = [];
/*=============
    ==============*/

const idMaker = () => {
  let ranNum = Math.floor(Math.random() * 999999);
  if (ids.includes(ranNum)) {
    while (ids.includes(ranNum)) {
      ranNum = Math.floor(Math.random() * 999999);
      if (!ids.includes(ranNum)) {
        ids.push(ranNum);
        return ranNum;
        break;
      }
    }
  } else {
    ids.push(ranNum);
    return ranNum;
  }
};

const gomibakoFactory = (identification) => {
  const gomibako = document.createElement('input');
  gomibako.type = 'image';
  gomibako.class = 'gomibako';
  gomibako.src = './assets/trash.png';
  gomibako.alt = 'DELETE';
  gomibako.style = 'width: 30px; height: 30px;';
  gomibako.identification = identification;
  gomibako.addEventListener('click', () => {
    for (let i = 0; i < currentSet.wordList.length; i++) {
      if (currentSet.wordList[i].id === gomibako.identification) {
        console.log(currentSet.wordList[i]);
        currentSet.wordList.splice(i, 1);
        console.log(currentSet.wordList);
      }
    }
    tableRowGarbage.forEach((element) => {
      element.remove();
    });
    tableRowGarbage.splice(0, tableRowGarbage.length);
    for (let i = 0; i < currentSet.wordList.length; i++) {
      itemCreater(i);
    }
  });
  return gomibako;
};

const itemCreater = (i) => {
  const id = idMaker();
  const gomibako = gomibakoFactory(id);
  const newRow = document.createElement('tr');
  const newWord = document.createElement('td');
  const newDef = document.createElement('td');
  const newDefinition = document.createElement('td');
  const gomibakoDataTable = document.createElement('td');
  const kanjiInput = document.createElement('input');
  const yomikataInput = document.createElement('input');
  const definitionInput = document.createElement('input');

  kanjiInput.type = 'text';
  yomikataInput.type = 'text';
  definitionInput.type = 'text';
  kanjiInput.name = 'kanji-input';
  yomikataInput.name = 'yomikata-input';
  definitionInput.name = 'definition-input';
  kanjiInput.maxLength = 10;
  yomikataInput.maxLength = 10;
  definitionInput.maxLength = 20;
  if (i || i === 0) {
    kanjiInput.value = currentSet.wordList[i].kanji;
    yomikataInput.value = currentSet.wordList[i].yomikata;
    if (currentSet.wordList[i].definition) {
      definitionInput.value = currentSet.wordList[i].definition;
    } else {
      definitionInput.value = '';
    }
    currentSet.wordList[i].id = id;
  } else {
    currentSet.wordList.push({ kanji: null, yomikata: null, definition: null, id: id });
  }
  kanjiInput.required = true;
  yomikataInput.required = true;
  definitionInput.required = false;
  newWord.appendChild(kanjiInput);
  newDef.appendChild(yomikataInput);
  newDefinition.appendChild(definitionInput);
  gomibakoDataTable.appendChild(gomibako);
  newRow.appendChild(newWord);
  newRow.appendChild(newDef);
  newRow.appendChild(newDefinition);
  newRow.appendChild(gomibakoDataTable);
  table.appendChild(newRow);
  tableRowGarbage.push(newRow); // store new elements in garbage so you can delete later.
  kanjiInput.addEventListener('change', () => {
    currentSet.wordList.forEach((element) => {
      if (element.id === id) {
        element.kanji = kanjiInput.value;
      }
    });
    console.log(currentSet);
  });
  yomikataInput.addEventListener('change', () => {
    currentSet.wordList.forEach((element) => {
      if (element.id === id) {
        element.yomikata = yomikataInput.value;
      }
    });
    console.log(currentSet);
  });
  definitionInput.addEventListener('change', () => {
    currentSet.wordList.forEach((element) => {
      if (element.id === id) {
        element.definition = definitionInput.value;
      }
    });
    console.log(currentSet);
  });
};

addWordButt.addEventListener('click', () => {
  itemCreater(false);
});

saveChangesButt.addEventListener('click', async () => {
  currentSet.wordList.forEach((element) => {
    delete element.id;
  });
  const req = await fetch('/edit-sets', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentSet)
  });
  const data = await req.json();
  console.log(data);
});

const getWords = async (setName) => {
  const res = await fetch(`/edit-sets/${setName}`);
  const data = await res.json();
  const title = data.requestedSet.title;
  const wordList = data.requestedSet.words;
  currentSet.title = title;
  currentSet.wordList = wordList;
  setTitle.appendChild(document.createTextNode(title));
  for (let i = 0; i < wordList.length; i++) {
    itemCreater(i);
  }
};
for (let i = 0; i < setEditButts.length; i++) {
  setEditButts[i].addEventListener('click', (e) => {
    getWords(e.target.value);
  });
}
