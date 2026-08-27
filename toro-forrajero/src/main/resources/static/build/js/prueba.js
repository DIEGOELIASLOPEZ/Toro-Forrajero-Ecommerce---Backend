// document.addEventListener('DOMContentLoaded', function(){
//     mostrarModal();
// })

// function mostrarModal() {
//     const modal = document.createElement('DIV');
//     const carga = document.createElement('DIV');
//     carga.innerHTML=  `
// 		<svg viewBox="25 25 50 50">
// 			<circle r="20" cy="50" cx="50"></circle>
// 		</svg>`
//     modal.classList.add('modal-overlay');


//     // modal.addEventListener('click', function () {
//     //     cerrarModal()
//     // })

//     const body = document.querySelector('body');
//     body.classList.add('overflow-hiden');
//     body.appendChild(modal);
//     modal.appendChild(carga);

//     setTimeout(() => {
//         modal.classList.add('is-visible');
//     }, 10);

// }

// function cerrarModal() {
//     const modal = document.querySelector('.modal-overlay');
//     const body = document.querySelector('body');


//     if (modal) {
//         modal.classList.remove('is-visible');
//         body.classList.remove('overflow-hiden');

//         setTimeout(() => {
//             modal.remove();
//         }, 300);
//     }

// }