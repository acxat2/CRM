let clientsBuffer = [];
const uri = 'http://localhost:3000';

function createTableRow(classList) {
  const tableRow = document.createElement('tr');
  tableRow.classList = classList;
  tableRow.setAttribute('tabindex', 0);
  return tableRow;
}

function createTableCell(classList) {
  const tableCell = document.createElement('td');
  tableCell.classList = classList;
  return tableCell;
}

function createElem(elem, classList, textContent) {
  const el = document.createElement(elem);
  el.classList = classList;
  el.textContent = textContent;
  return el;
}

function createModalContainerName() {
  const containerName = createElem('div', 'modal__container_name');
  containerName.setAttribute('id', 'modalContainerName');
  return containerName;
}

function createModalContainerBtns() {
  const containerBtns = createElem('div', 'modal__container_btns');
  containerBtns.setAttribute('id', 'modalContainerBtns');
  return containerBtns;
}

function createInputContainer(createContainer, createLabel, createStar) {
  const star = createStar;
  const label = createLabel;
  const container = createContainer;
  label.append(star);
  container.append(label);
  return container;
}

function createInput(type, classList, name) {
  const input = document.createElement('input');
  input.setAttribute('type', type);
  input.classList = classList;
  input.setAttribute('name', name);
  return input;
}

function createContactIcon(classList, href, type) {
  const a = document.createElement('a');
  a.classList = classList;
  a.setAttribute('data-type', type);
  a.setAttribute('tabindex', 0);
  a.setAttribute('href', href);
  return a;
}

async function getData(url) {
  const response = await fetch(url);
  return await response.json();
}

function formatDateTime(date) {
  const getDate = date.split('T')[0].split('-').reverse().join('.')
  const getTime = date.split('T')[1].split('').slice(0, 5).join('')
  return {
    getDate,
    getTime}
}

function createContacts(clients, i, contactsContainer) {
  let j = 1;
  for(let contact of clients[i].contacts) {

    if(contact.type === 'Vk') {
      const vk = createContactIcon("client__contacts_icon client__contacts_vk", contact.value, contact.type);
      vk.id = `${contact.type}${clients[i].id}`;
      contactsContainer.append(vk);
    } else {
      if(contact.type === 'Facebook') {
        const fb = createContactIcon("client__contacts_icon client__contacts_fb", contact.value, contact.type);
        fb.id = `${contact.type}${clients[i].id}`;
        contactsContainer.append(fb);
      } else {
        if(contact.type === 'Телефон') {
          const phon = createContactIcon("client__contacts_icon client__contacts_phone", contact.value, contact.type);
          phon.id = `${contact.type}${clients[i].id}`;
          contactsContainer.append(phon);
        } else {
          if(contact.type === 'Email') {
            const email = createContactIcon("client__contacts_icon client__contacts_mail",contact.value, contact.type);
            email.id = `${contact.type}${clients[i].id}`;
            contactsContainer.append(email);
          } else {
            const anotherContact = createContactIcon("client__contacts_icon client__contacts_man another-client", contact.value, contact.type);
            anotherContact.id = `${contact.type}${j++}${clients[i].id}`;
            contactsContainer.append(anotherContact);
          }
        }
      }
    }
  }
}

function choiceArray(clientsArr, clientsBuffer) {
  let arr;
  if(clientsBuffer.length < 1) {
    arr = clientsArr;
  } else {
    arr = clientsBuffer;
  }
  return arr;
}

function tbodyRemove() {
  document.getElementById('tableBodyScroll').remove();
}

function focusBlurInput(input, label, classList) {
  if(input.value.trim()) {
    label.classList.add(classList);
  }
  input.addEventListener('focus', () => {
    label.classList.add(classList);
  })
  input.addEventListener('blur', () => {
    if(!input.value.trim()) {
      label.classList.remove(classList);
    }
  })
}
// modalWindowOverlay
function select() {
  const selectHeader = document.querySelectorAll('.select__header');
  const option = document.querySelectorAll('.option');

  selectHeader.forEach(item => {
    item.addEventListener('click', selectToggle);
  })
  option.forEach(item => {
    item.addEventListener('click', selectChoose);
  })

  function selectToggle() {
    this.parentElement.classList.toggle('is-active');
    this.childNodes[1].classList.toggle('select__icon-reverse');
  }

  function selectChoose() {
    const text = this.innerText,
          select = this.closest('.select'),
          currentText = select.querySelector('.select__current'),
          selectIcon = select.querySelector('.select__icon');
    currentText.innerText = text;
    select.classList.remove('is-active');
    selectIcon.classList.remove('select__icon-reverse');

  }
}

function btnDelContactDisplay(input, button) {
  function condition() {
    if(input.value.trim()) {
      input.classList.add('contact_input-value');
      button.classList.remove('display_none')
    } else {
      input.classList.remove('contact_input-value');
      button.classList.add('display_none')
    }
  }
  condition()

  input.addEventListener('input', condition)

  // input.addEventListener('keydown', function() {
  //   input.oninput = function() {
  //     condition()
  //   }
  // })
}

function sliceID(id) {
  return id.slice(3, 9);
}


document.addEventListener('DOMContentLoaded', async () => {
  let numberSort;
  let flagSort;
  let newClient;
  let clients = (await getClients(uri + `/api/clients`)).data;

  function createContactsContainer(clients, i) {
    const contactsContainer = createElem('div', "client__contacts_icon_container");
    createContacts(clients, i, contactsContainer);
    return contactsContainer;
  }

  // Функция отрисовки таблицы
  function drawTable(clients, tbody, tableRow, tableCellID, tableCellName, tableCellCreate, tableCellChange, tableCellContacts, tableCellBtnChange, tableCellBtnDelete,i) {
    const id = (clients[i].id);//;
    const name = clients[i].name;
    const surname = clients[i].surname;
    const lastName = clients[i].lastName;
    const dateCreate = formatDateTime(clients[i].createdAt).getDate;
    const timeCreate = formatDateTime(clients[i].createdAt).getTime;
    const dateChange = formatDateTime(clients[i].updatedAt).getDate;
    const timeChange = formatDateTime(clients[i].updatedAt).getTime;

    tableCellID.innerHTML = sliceID(id);
    // tableCellID.setAttribute('data-id', id)
    tableCellName.innerHTML = `${surname} ${name} ${lastName}`;
    tableCellCreate.innerHTML = `${dateCreate} <span class="client__time">${timeCreate}</span>`;
    tableCellChange.innerHTML = `${dateChange} <span class="client__time">${timeChange}</span>`;
    tableCellContacts.append(createContactsContainer(clients, i));
    const clientBtnChange = createElem('button', 'client__btn_change', 'Изменить');
    const changeIcon = createElem('span', 'client__btn_change_icon btn-icon');
    clientBtnChange.setAttribute('id', `change${id}`);
    const clientBtnDelete = createElem('button', 'client__btn_delete', 'Удалить');
    const deleteIcon = createElem('span', 'client__btn_delete_icon btn-icon');
    clientBtnDelete.setAttribute('id', `delete${id}`);
    clientBtnChange.prepend(changeIcon);
    clientBtnDelete.prepend(deleteIcon);
    tableCellBtnChange.append(clientBtnChange);
    tableCellBtnDelete.append(clientBtnDelete);

    tableRow.append(tableCellID, tableCellName, tableCellCreate, tableCellChange, tableCellContacts, tableCellBtnChange, tableCellBtnDelete);
    tbody.append(tableRow);
  }

  // Прикрепляю туллтипы к контактам
  const contactsCollection = document.getElementsByClassName('client__contacts_icon');
  function assingTooltipContact(collection) {
    for(let contact of collection) {
      tippy(`#${contact.getAttribute('id')}`, {
        content: `${contact.getAttribute('data-type')}: ${contact.getAttribute('href')}`
      })
    }
  }

  // Создаю таблицу, заполняю данными из массива
  const tableContainer = document.getElementById('tableContainer');

  function createTable (clients) {
    const tableBodyScroll = createElem('div', 'scroll');
    tableBodyScroll.setAttribute('id', 'tableBodyScroll');
    const table = createElem('table', 'clients__table table');
    table.setAttribute('id', 'tableScroll');
    const tableBody = createElem('tbody', 'tbody');

    table.append(tableBody);
    tableBodyScroll.append(table);
    tableContainer.append(tableBodyScroll);

    // Отрисовываю таблицу из массива данных
    for(let i = 0; i < clients.length; ++i) {
      const tableRow = createTableRow("tr-client");
      const tableCellID = createTableCell('client__id col col_id');
      const tableCellName = createTableCell('client__name col col_name');
      const tableCellCreate = createTableCell('client__date col col_addDate');
      const tableCellChange = createTableCell('client__date col col_changeDate');
      const tableCellContacts = createTableCell('client__contacts col col_contacts');
      const tableCellBtnChange = createTableCell('client__change col col_change');
      const tableCellBtnDelete = createTableCell('client__delete col col_delete');

      drawTable(clients,tableBody, tableRow, tableCellID, tableCellName, tableCellCreate, tableCellChange, tableCellContacts, tableCellBtnChange, tableCellBtnDelete,i);
    }

    // проверяю на наличие больше 5 контактов в контейнере
    const contactsIcon = document.getElementsByClassName('client__contacts_icon_container');

    for(let i = 0; i < contactsIcon.length; i++) {
      if(contactsIcon[i].childElementCount > 5) {
        for(let j = 4; j < contactsIcon[i].childElementCount; j++) {
          contactsIcon[i].childNodes[j].setAttribute('style', `display: none`);
        }
        const moreContacts = document.createElement('button');
        moreContacts.classList = 'client__contacts_more';
        moreContacts.textContent = `+${contactsIcon[i].childElementCount - 4}`;
        contactsIcon[i].append(moreContacts);

        const contact = contactsIcon[i];
        moreContacts.addEventListener('click', () => {
          moreContacts.remove();
          for(let j = 4; j < contact.childElementCount; j++) {
            contact.childNodes[j].removeAttribute('style');
          }
        })
      }
    }
    assingTooltipContact(contactsCollection);
  }
  createTable (clients);

  // if(clients.length) {
  // const tableBodyScroll = document.getElementById('tableBodyScroll');
  // }

  const thId = document.querySelector('.sort__id');
  const thName = document.querySelector('.sort__name');
  const thAdd = document.querySelector('.sort__addDate');
  const thChange = document.querySelector('.sort__changeDate');

  let timeout;
  const search = document.getElementById('search');

  // Функция пойска
  function findContacts(arrFind, arrSearch, inputSearch) {
    arrFind.splice(0)
    for(let i = 0; i <= arrSearch.length - 1; i++) {
      if(arrSearch[i].id.toLowerCase().indexOf(inputSearch) !== -1
      || arrSearch[i].name.toLowerCase().indexOf(inputSearch) !== -1
      || arrSearch[i].surname.toLowerCase().indexOf(inputSearch) !== -1
      || arrSearch[i].lastName.toLowerCase().indexOf(inputSearch) !== -1
      || arrSearch[i].createdAt.toLowerCase().indexOf(inputSearch) !== -1
      || arrSearch[i].updatedAt.toLowerCase().indexOf(inputSearch) !== -1)
      {
        arrFind.push(arrSearch[i]);
      }
    }
  }

  // Поиск по нажатию клавиши
  search.addEventListener('keydown', function() {
    search.oninput = async function() {
      const clients = await getData(uri + `/api/clients`);
      clearTimeout(timeout);
      timeout = setTimeout(searchContact, 300);
      const resultSearch = search.value.trim().toLowerCase();

      function searchContact() {
        findContacts(clientsBuffer, clients, resultSearch);
        tbodyRemove();
        createTable(clientsBuffer);
        activeBtnDeleteClient();
        activeBtnChangeClient();
      }
    }
  })

  let id
  // Элементы шаблона модального окна
  const createClient = document.getElementById('createClient');
  const modalWindowOverlay = document.getElementById('modalWindowOverlay');
  const modalContainer = document.getElementById('formContact');
  const modalContainerName = createModalContainerName();
  const modalContainerBtns = createModalContainerBtns();
  const modalBtnSave = createElem('button', 'modal__btn_firm', 'Сохранить');
  const modalBtnDel = createElem('button', 'modal__btn_firm', 'Удалить');
  const modalBtnUnderlineCancel = createElem('button', 'modal__btn_underline', 'Отмена');
  const modalBtnUnderlineDel = createElem('button', 'modal__btn_underline', 'Удалить клиента');
  const modalHead = createElem('div', 'modal__head modal__left');
  const modalTitleNew= createElem('h3', 'modal__title', 'Новый клиент');
  const inputNameContainer = createElem('div', 'modal__form modal__left');
  const modalErrorMessage = createElem('p', 'contact_error display_none');

  const labelSurename = createElem('label', 'form_label_surename form_label_placeholder', 'Фамилия');
  const labelName = createElem('label', 'form_label_name form_label_placeholder', 'Имя');
  const labelLastName = createElem('label', 'form_label_lastName form_label_placeholder', 'Отчество');
  const inputContainer1 = createInputContainer(createElem('div', 'relative modal__form_input'), labelSurename, createElem('span', 'color_firm', '*'));
  const inputContainer2 = createInputContainer(createElem('div', 'relative modal__form_input'), labelName, createElem('span', 'color_firm', '*'));
  const inputContainer3 = createInputContainer(createElem('div', 'relative modal__form_input'), labelLastName, createElem('span', 'color_firm', ''));
  const inputSurename = createInput('text', 'surenameClient input_value', 'surename');
  inputSurename.setAttribute('name', 'surename');
  inputSurename.setAttribute('required', '');
  const inputName = createInput('text', 'nameClient input_value', 'name');
  inputName.setAttribute('name', 'name');
  inputName.setAttribute('required', '');
  const inputLastName = createInput('text', 'lastNameClient input_value', 'lastName');
  inputLastName.setAttribute('name', 'lastname');

  function appContact(type, value) {
    const appDiv = createElem('div', 'append__contact');
    const selectContainer = createElem('div', 'append__contact_select select');
    const selectHeader = createElem('div', 'select__header');
    selectHeader.setAttribute('tabindex', 0)
    const selectCurrent = createElem('span', 'select__current', 'Телефон');
    const selectIcon = createElem('div', 'select__icon');
    const selectBody = createElem('div', 'select__body');
    const optionPhon = createElem('div', 'option', 'Телефон');
    const optionEmail = createElem('div', 'option', 'Email');
    const optionFacebook = createElem('div', 'option', 'Facebook');
    const optionVk = createElem('div', 'option', 'Vk');
    const optionAnother = createElem('div', 'option', 'Другое');
    const input = createInput('', 'append__contact_input', 'contactValue');

    const mediaQuery = window.matchMedia("screen and (max-width: 600px)");
    mediaQuery.addListener(changePlaceholder);
    changePlaceholder(mediaQuery, input);


    const button = createElem('button', 'btn__del_contact display_none');
    button.innerHTML = '<svg width="27" height="37" viewBox="0 0 27 37" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="26" height="36" fill="#E7E5EB" stroke="#C8C5D1"/><path d="M14 13C10.682 13 8 15.682 8 19C8 22.318 10.682 25 14 25C17.318 25 20 22.318 20 19C20 15.682 17.318 13 14 13ZM14 23.8C11.354 23.8 9.2 21.646 9.2 19C9.2 16.354 11.354 14.2 14 14.2C16.646 14.2 18.8 16.354 18.8 19C18.8 21.646 16.646 23.8 14 23.8ZM16.154 16L14 18.154L11.846 16L11 16.846L13.154 19L11 21.154L11.846 22L14 19.846L16.154 22L17 21.154L14.846 19L17 16.846L16.154 16Z" fill="#B0B0B0"/></svg>'

    selectHeader.append(selectCurrent, selectIcon);
    selectBody.append(optionPhon, optionEmail, optionVk, optionFacebook, optionAnother);
    selectContainer.append(selectHeader, selectBody);
    appDiv.append(selectContainer, input, button);

    function changePlaceholder(mq, inp) {
      if (mq.matches) {
        inp.setAttribute('placeholder', 'Введите данные');
      } else {
        inp.setAttribute('placeholder', 'Введите данные контакта');
      }
    }

    function assignType() {
      optionPhon.addEventListener('click', () => {
        input.setAttribute('type', 'tel')
        input.setAttribute('data', 'tel')
        contactMask('tel', '+7 (999)-999-99-99')
      })
      optionEmail.addEventListener('click', () => {
        input.setAttribute('type', 'email')
        input.setAttribute('data', 'email')
        contactMask('email', '*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]@*{1,63}.*{1,63}[.*{1,63}][.*{1,63}]')
      })
      optionVk.addEventListener('click', () => {
        input.setAttribute('type', 'text')
        input.setAttribute('data', 'vk')
        contactMask('vk', '*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]')
      })
      optionFacebook.addEventListener('click', () => {
        input.setAttribute('type', 'text')
        input.setAttribute('data', 'fb')
        contactMask('fb', '*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]')
      })
      optionAnother.addEventListener('click', () => {
        input.setAttribute('type', 'text')
        input.setAttribute('data', 'another')
        contactMask('another', '*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]')
      })
    }

    if(value) {
      setAttrContactInput(type, input)
      assignType()
      selectCurrent.innerText = type;
      input.value = value;
    } else {
      input.setAttribute('type', 'tel');
      input.setAttribute('data', 'tel');
      assignType()
    }

    btnDelContactDisplay(input, button)

    button.addEventListener('click', () => {
      btnAppContact.classList.remove('display_none');
      appDiv.remove();
      if(!contactsForm.childElementCount) {
          modalContainerContacts.classList.remove('modal__container_contacts');
      }
    })

    select()

    return {
      appDiv
    }
  }

  // Элементы кнопки "Добавить контакт"
  const modalContainerContacts = createElem('div', 'modal__container_contacts-start append');
  const btnAppContactContainer = createElem('div', 'append__contact_btn-container')
  const btnAppContact = createElem('button', 'append__contact_btn append__contact_btn_text', 'Добавить контакт');
  const iconPlus = createElem('span', 'add_circle_outline');
  const contactsForm = createElem('div', 'append__contacts_container');

  // Добавление контакта
  btnAppContact.addEventListener('click', (e) => {
    e.preventDefault();
    if(contactsForm.childElementCount < 10) {
      modalContainerContacts.classList.add('modal__container_contacts');
      contactsForm.append(appContact().appDiv);
      modalContainerContacts.prepend(contactsForm);
    }
    if(contactsForm.childElementCount === 10) {
      btnAppContact.classList.add('display_none');
    }
    select();
    contactMask('tel', '+7 (999)-999-99-99')
  })


  // Элементы кнопки 'Удалить клиента'
  const modalTitleDel = createElem('h3', 'modal__title', 'Удалить клиента');
  const modalTextDel = createElem('p', 'modal__text_del', 'Вы действительно хотите удалить данного клиента?');
  const delClientAll = document.getElementsByClassName('client__btn_delete');

  function renderingModalDell () {
    modalHead.append(modalTitleDel);
    modalHead.classList.add('text-center');

    modalContainerBtns.append(modalBtnDel, modalBtnUnderlineCancel);
    modalContainer.append(modalHead, modalTextDel, modalErrorMessage, modalContainerBtns);
    modalWindowOverlay.classList.toggle('open');
  }

  function activeBtnDeleteClient() {
    for(let delClient of delClientAll) {
      const delClientID = document.getElementById(delClient.getAttribute('id'));
      delClientID.addEventListener('click', () => {
        id = delClientID.getAttribute('id').split('delete')[1];
        renderingModalDell();
      })
    }
  }
  activeBtnDeleteClient()

  // Oтрисовываю модальное окно "Новый клиент"
  createClient.addEventListener('click', () => {
    newClient = true
    modalHead.append(modalTitleNew);
    modalContainerName.append(modalHead);

    inputContainer1.append(inputSurename);
    inputContainer2.append(inputName);
    inputContainer3.append(inputLastName);
    inputNameContainer.append(inputContainer1, inputContainer2, inputContainer3);
    modalContainerName.append(inputNameContainer);

    btnAppContact.prepend(iconPlus);
    btnAppContactContainer.append(btnAppContact);
    modalContainerContacts.append(btnAppContactContainer);

    modalContainerBtns.append(modalBtnSave, modalBtnUnderlineCancel);
    modalContainer.append(modalContainerName, modalContainerContacts, modalErrorMessage, modalContainerBtns);

    modalWindowOverlay.classList.toggle('open');

    const surename = document.querySelector('.surenameClient');
    const name = document.querySelector('.nameClient');
    const lastName = document.querySelector('.lastNameClient');
    const labelSurename = document.querySelector('.form_label_surename');
    const labelName = document.querySelector('.form_label_name');
    const labelLastName = document.querySelector('.form_label_lastName');

    focusBlurInput(surename, labelSurename, "form_label")
    focusBlurInput(name, labelName, "form_label")
    focusBlurInput(lastName, labelLastName, "form_label")

  })

  // Элементы кнопки 'Изменить клиента'
  const modatTitleChangeId = createElem('p', 'modal__idClient');
  const modatTitleChange = createElem('h3', 'modal__title', 'Изменить данные');
  const changeClientAll = document.getElementsByClassName('client__btn_change');

  function activeBtnChangeClient() {
    for(let changeClient of changeClientAll) {
      const changeClientID = document.getElementById(changeClient.getAttribute('id'));
      changeClientID.addEventListener('click', async () => {
        newClient = false;

        id = changeClientID.getAttribute('id').split('change')[1];
        modatTitleChangeId.innerText = `ID: ${sliceID(id)}`
        modatTitleChangeId.classList.add('open')
        const dataClient = (await getClients(uri + `/api/clients/${id}`)).data;

        inputSurename.value = dataClient.surname;
        inputName.value = dataClient.name;
        inputLastName.value = dataClient.lastName;
        modalHead.append(modatTitleChange, modatTitleChangeId);
        modalContainerName.append(modalHead);
        inputContainer1.append(inputSurename)
        inputContainer2.append(inputName)
        inputContainer3.append(inputLastName)
        inputNameContainer.append(inputContainer1, inputContainer2, inputContainer3)
        modalContainerName.append(inputNameContainer);

        btnAppContact.prepend(iconPlus);
        btnAppContactContainer.append(btnAppContact)
        modalContainerContacts.append(btnAppContactContainer);

        if(dataClient.contacts.length > 0) {
          for(let i = 0; i < dataClient.contacts.length; i++) {
            modalContainerContacts.classList.add('modal__container_contacts');
            contactsForm.append(appContact(dataClient.contacts[i].type, dataClient.contacts[i].value).appDiv);
            modalContainerContacts.prepend(contactsForm);
          }
        }

        modalContainerBtns.append(modalBtnSave, modalBtnUnderlineDel);
        modalContainerBtns.append();
        modalContainer.append(modalContainerName, modalContainerContacts, modalErrorMessage, modalContainerBtns);

        modalWindowOverlay.classList.toggle('open');

        const surename = document.querySelector('.surenameClient');
        const name = document.querySelector('.nameClient');
        const lastName = document.querySelector('.lastNameClient');
        const labelSurename = document.querySelector('.form_label_surename');
        const labelName = document.querySelector('.form_label_name');
        const labelLastName = document.querySelector('.form_label_lastName');

        focusBlurInput(surename, labelSurename, "form_label");
        focusBlurInput(name, labelName, "form_label");
        focusBlurInput(lastName, labelLastName, "form_label");
        select();

        // Надеваю маски на инпуты загруженных контактов, и скрываю селекты при нажатии не в них.
        const celectOpen = document.querySelectorAll('.select');
        celectOpen.forEach(item => {
          f(item.nextSibling.getAttribute('data'));
          document.addEventListener('click', (e) => {
            let activeSelect = e.target.closest('.is-active');
            if (!activeSelect) {
              item.classList.remove('is-active');
              item.firstChild.lastChild.classList.remove('select__icon-reverse');
            }
          })
        })
      })
    }

  }
  activeBtnChangeClient()

  function reloadTable() {
    tbodyRemove();
    createTableReload(numberSort);
    activeBtnDeleteClient();
    activeBtnChangeClient()
    removeDataWindow();
  }

  // Действие на кнопку "Удалить клиента"
  modalBtnUnderlineDel.addEventListener('click', () => {
    removeDataWindow()
    renderingModalDell ()
  })

  // Действие на кнопку "Удалить"
  modalBtnDel.addEventListener('click', async (e) => {
    e.preventDefault();
    const response = await delClientNahren(uri + `/api/clients/${id}`);
    clients = (await getClients(uri + `/api/clients`)).data;
    statusResponse(response);
  })

  function createTableReload(numberSort) {
    if(numberSort === 2) {
      sortName();
    } else {
      if(numberSort === 3) {
        sortAdd();
      } else {
        if(numberSort === 4) {
          sortChange();
        }
      }
    }

    if(flagSort === true) {
      createTable(choiceArray(clients, clientsBuffer).reverse());
    } else {
      createTable(choiceArray(clients, clientsBuffer));
    }
  }

  function nameCorrect(name) {
    return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
  }

  function validateName(nameInput) {
    if(nameInput.value.trim().length >= 1) {
      return true
    } else {
      return ' имя'
    }
  }

  function validateSurename(surenameInput) {
    if(surenameInput.value.trim().length >= 1) {
      return true
    } else {
     return ' фамилию';
    }
  }


    // Действие на кнопку "Сохранить"
  modalBtnSave.addEventListener('click', async (e) => {
    const name = document.querySelector('.nameClient');
    const surename = document.querySelector('.surenameClient');
    const lastName = document.querySelector('.lastNameClient');

    let errorsMessage = []
    let contacts = [];
    let flag = true;
    const contactsCollect = document.getElementsByClassName('append__contact');

    let arrValidate = [
      validateName(name),
      validateSurename(surename)
    ]

    for(let i = 0; i < contactsCollect.length; i++) {
      if(contactsCollect[i].childNodes[1].value) {
        const contact = contactsCollect[i].childNodes[1].getAttribute('data')
        contacts.push({'type': contactsCollect[i].firstChild.firstChild.firstChild.innerText, 'value': contactsCollect[i].childNodes[1].value})
        console.log(contactsCollect[i].childNodes[1].value)
      } else {

      }
    }

    for(let i of arrValidate) {
      if(i !== true) {
        flag = false
        errorsMessage.push(i)
      }
    }

    e.preventDefault();



    // let inputs = []
    // const formElements = document.forms[1].elements;
    // for(let el of formElements) {
    //   if(el.tagName === 'INPUT') {
    //     inputs.push(el);
    //   }
    // }


    if(flag) {
      if(newClient) {
        const response = await createNewClient(uri + '/api/clients', nameCorrect(name.value), nameCorrect(surename.value), nameCorrect(lastName.value), contacts);
        clients = (await getClients(uri + `/api/clients`)).data;
        statusResponse(response)
      } else {
        const response = await changeData(uri + `/api/clients/${id}`, nameCorrect(name.value), nameCorrect(surename.value), nameCorrect(lastName.value), contacts);
        clients = (await getClients(uri + `/api/clients`)).data;
        statusResponse(response)
      }
    } else {
      modalErrorMessage.classList.remove('display_none');
      modalErrorMessage.textContent = `Введите корректные данные:${errorsMessage}`;
    }
  })

  // Закрытие модального окна нажатием на фон
  modalWindowOverlay.addEventListener('click', (e) => {
    if (e.target == modalWindowOverlay) {
      removeDataWindow()
    }
  })

  // Закрытие модального окна кнопкой "закрыть"
  const modalClose = document.getElementById('btnModalClose');
  modalClose.addEventListener('click', (e) => {
    e.preventDefault()
    removeDataWindow()
  })

  // Закрытие модального окна кнопкой "Отмена"
  modalBtnUnderlineCancel.addEventListener('click', (e) => {
    e.preventDefault()
    removeDataWindow();
  })

  function statusResponse(response) {
    if(response === 200 || response === 201) {
      reloadTable()
    } else {
      modalErrorMessage.classList.remove('display_none');
      if(response >= 500 && response < 600) {
        modalErrorMessage.textContent = 'Ошибка сервера';
      } else {
        switch(response) {
          case 422: modalErrorMessage.textContent = 'Ошибка: необработанный объект';
          break;
          case 404: modalErrorMessage.textContent = 'Ошибка: ресурс не найдено';
          break;
          default: modalErrorMessage.textContent = 'Что-то пошло не так';
        }
      }
    }
  }

  function removeDataWindow() {
    inputSurename.value = ''
    inputName.value = ''
    inputLastName.value = ''
    labelSurename.classList.remove('form_label')
    labelName.classList.remove('form_label')
    labelLastName.classList.remove("form_label")
    modalContainerContacts.classList.remove('modal__container_contacts');
    modalContainerName.remove();
    modalContainerContacts.remove();
    modalTitleNew.remove();
    modatTitleChange.remove();
    modatTitleChangeId.remove();
    modalTitleDel.remove();
    btnAppContact.classList.remove('display_none');
    modalErrorMessage.classList.add('display_none');

    while (contactsForm.firstChild) {
      contactsForm.removeChild(contactsForm.firstChild);
    }
    modalBtnUnderlineCancel.remove();
    modalBtnUnderlineDel.remove();
    modalTextDel.remove();
    modalBtnSave.remove()
    modalBtnDel.remove()
    modalWindowOverlay.classList.toggle('open');
  }

  function sorting(flag, th) {
    if(flag) {
      flagSort = true;
      tbodyRemove();
      createTable(choiceArray(clients, clientsBuffer).reverse());
      activeBtnDeleteClient();
      activeBtnChangeClient();
      th.firstElementChild.classList = 'sort__arrow arrowReverse'
      flag = false;
    } else {
      flagSort = false
      tbodyRemove();
      createTable(choiceArray(clients, clientsBuffer));
      activeBtnDeleteClient();
      activeBtnChangeClient();
      th.firstElementChild.classList = 'sort__arrow'
      flag = true;
    }
    return flag;
  }

  // Сортировка по id
  let idFlag = true;
  function sortID() {
    choiceArray(clients, clientsBuffer).sort(function compare(a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    })
  }
  thId.addEventListener('click', function() {
    numberSort = 1;
    thId.classList.add('sort_checked');
    sortID();
    idFlag = sorting(idFlag, thId);
  })

  // Сортировка по фамилии
  let nameFlag = false;
  function sortName() {
    choiceArray(clients, clientsBuffer).sort(function compare(a, b) {
      if (a.surname + a.name + a.lastName > b.surname + b.name + b.lastName) {
        return 1;
      }
      if (a.surname + a.name + a.lastName < b.surname + b.name + b.lastName) {
        return -1;
      }
      return 0;
    })
  }
  thName.addEventListener('click', () => {
    numberSort = 2;
    thName.classList.add('sort_checked');
    sortName();
    nameFlag = sorting(nameFlag, thName);
  })

  // Сортировка по дате создания
  let addFlag = false;
  function sortAdd() {
    choiceArray(clients, clientsBuffer).sort(function compare(a, b) {
      if (a.createdAt > b.createdAt) {
        return 1;
      }
      if (a.createdAt < b.createdAt) {
        return -1;
      }
      return 0;
    })
  }

  thAdd.addEventListener('click', function() {
    numberSort = 3;
    thAdd.classList.add('sort_checked');
    sortAdd();
    addFlag = sorting(addFlag, thAdd);
  })

    // Сортировка по дате изменения
  let changeFlag = false;
  function sortChange() {
    choiceArray(clients, clientsBuffer).sort(function compare(a, b) {
      if (a.updatedAt > b.updatedAt) {
        return 1;
      }
      if (a.updatedAt < b.updatedAt) {
        return -1;
      }
      return 0;
    })
  }

  thChange.addEventListener('click', function() {
    numberSort = 4;
    thChange.classList.add('sort_checked');
    sortChange();
    changeFlag = sorting(changeFlag, thChange);
  })
})

async function delClientNahren(url) {
  const response = await fetch(url, {
    method: 'DELETE',
  })
  const statusResponse = response.status;
  return statusResponse;
}

async function getClients(url) {
  const response = await fetch(url, {
  method: 'GET',
  });
  const statusResponse = response.status;
  const data = await response.json();
  return {statusResponse,
    data};
}

async function createNewClient(url, name, surname, lastName, contacts) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: name,
      surname: surname,
      lastName: lastName,
      contacts: contacts
    })
  });
  const statusResponse = response.status;
  return statusResponse;
}

async function changeData(url, name, surname, lastName, contacts) {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: name,
      surname: surname,
      lastName: lastName,
      contacts: contacts
    })
  });
  const statusResponse = response.status;
  return statusResponse;
}

function f(type) {
  switch (type) {
    case 'tel': return contactMask('tel', '+7 (999)-999-99-99')
    case 'email': contactMask('email', '*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]@*{1,63}.*{1,63}[.*{1,63}][.*{1,63}]')
    case 'vk': return contactMask('vk', '*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]')
    case 'fb': return contactMask('fb', '*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]')
    default: return contactMask('another', '*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]')
  }
}

function setAttrContactInput(type, input) {
  switch (type) {
    case 'Телефон': return input.setAttribute('data', 'tel'), input.setAttribute('type', 'tel')
    case 'Email': return input.setAttribute('data', 'email'), input.setAttribute('type', 'email')
    case 'Vk': return input.setAttribute('data', 'vk'), input.setAttribute('type', 'text')
    case 'Facebook': return input.setAttribute('data', 'fb'), input.setAttribute('type', 'text')
    default: return input.setAttribute('data', 'another'), input.setAttribute('type', 'text')
  }
}

function contactMask(dataAttr, maska) {
  var selector = document.querySelector(`input[data=${dataAttr}]`);
  var im = new Inputmask(maska);
  im.mask(selector);

  // let validateForms = function(selector, rules) {
  //   new window.JustValidate(selector, {
  //     rules: rules,

  //   });
  // }
  // new JustValidate('.form', {
  //   rules: {
  //     name: {
  //       required: true,
  //       minLength: 2,
  //       maxLength: 30
  //     },
  //     tel: {
  //       required: true,
  //       function: (name, value) => {
  //         const phone = selector.inputmask.unmaskedvalue()
  //         return Number(phone) && phone.length === 10
  //       }
  //     },
  //     mail: {
  //       required: true,
  //       email: true
  //     }
  //   }
    // messages: {
    //   name: {
    //     required: "Вы ввели не правильно имя",
    //   },
    //   mail: {
    //     required: "Вы ввели не правильно E-meil",
    //   },
    //   tel: {
    //     required: "Вы ввели не правильно телефон",
    //   },
    // },
  // });
}

// function validator() {

// }
