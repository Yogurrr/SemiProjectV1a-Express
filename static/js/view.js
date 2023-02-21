let updatebtn = document.querySelector('#updatebtn');
let deletebtn = document.querySelector('#deletebtn');
let bno2 = document.querySelector('#bno2').value;
let uid = document.querySelector('#uid').value;

updatebtn?.addEventListener('click', () => {
    location.href = '/board/update?bno2=' + bno2 + '&uid=' + uid;
});

deletebtn?.addEventListener('click', () => {
    if (confirm('정말로 삭제하시겠습니까?'))
        location.href = '/board/delete?bno2=' + bno2 + '&uid=' + uid;
});