let inputSubmit = document.querySelector('#input-submit');
let inputTitle = document.querySelector('#input-title');
let inputAuthor = document.querySelector('#input-author');
let inputForm = document.querySelector('#add-book-form');
let editBtns = document.querySelectorAll('.btn-edit');
let deleteBtns = document.querySelectorAll('.btn-delete');
let bookDetailCont = document.querySelector('#book-details');
let editTitle = document.querySelector('#edit-title');
let editAuthor = document.querySelector('#edit-author');
let editId = document.querySelector('#edit-id');
let deleteAuthor = document.querySelector('#delete-author');
let deleteTitle = document.querySelector('#delete-title');
let deleteId = document.querySelector('#delete-id');

inputForm.addEventListener('submit', (e)=>{
	e.preventDefault();
	axios.post('/api/books', {
	    title: inputTitle.value,
	    author: inputAuthor.value
	  })
	  .then(function (response) {
	    window.location.reload(true);
	  })
	  .catch(function (error) {
	    console.log(error);
	  });


});

bookDetailCont.addEventListener("click", (e)=>{
	let bookParent = e.target.parentElement.parentElement.parentElement;
	let bookId = bookParent.querySelector('.book-title').getAttribute('data-id');
	let bookTitle = bookParent.querySelector('.book-title').textContent;
	let bookAuthor = bookParent.querySelector('.book-author').textContent;
	let populateform =(modaltype, modal)=> {
		modaltype = modaltype;
		modal = modal;
		modal.querySelector(`#${modaltype}-title`).value = bookTitle;
		modal.querySelector(`#${modaltype}-id`).value = bookId;
		modal.querySelector(`#${modaltype}-author`).value = bookAuthor;
	}
	let modalWork = (modaltype)=>{
		let modal = document.querySelector(`#${modaltype}-form-modal`);
		let bgOvrlay = document.querySelector(`#${modaltype}-form-modal.bg-overlay`);
		modal.classList.remove('hide-modal');
		populateform(modaltype, modal);
		if (!modal.classList.contains('hide-modal')) {
			bgOverlay.addEventListener('click', (e)=>{
				modal.classList.add('hide-modal');
			})
		}
	}


	if (e.target.classList.contains('btn')) {
		if (e.target.classList.contains('btn-edit')) {
				modalWork('edit');
		} else if (e.target.classList.contains('btn-delete')) {
			modalWork('delete');
		}
	} else {}
});

document.querySelector('#edit-form-modal').addEventListener('submit', (e) => {
	e.preventDefault();
	axios.put(`/api/books/${editId.value}`, {
	    title: editTitle.value,
	    author: editAuthor.value
	  })
	  .then(function (response) {
	    window.location.reload(true);
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
});

document.querySelector('#delete-form-modal').addEventListener('submit', (e) => {
	e.preventDefault();
	axios.delete(`/api/books/${deleteId.value}`, {
	    title: deleteTitle.value,
	    author: deleteAuthor.value
	  })
	  .then(function (response) {
	    window.location.reload(true);
	  })
	  .catch(function (error) {
	    console.log(error);
	  });

})