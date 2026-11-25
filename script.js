const quizData = [
  {category:"KONSEP DASAR",question:"Dalam pemrograman berorientasi objek, apa yang dimaksud dengan class?",options:["Hasil akhir dari proses kompilasi","Cetakan atau blueprint untuk membuat objek","Variabel yang hanya dapat dibaca","Fungsi khusus untuk menghapus objek","Kumpulan database","Perintah untuk menjalankan program"],correctIndex:1,explanation:"Class adalah blueprint atau cetakan yang mendefinisikan atribut (data) dan method (perilaku) yang akan dimiliki oleh objek."},
  {category:"KONSEP DASAR",question:"Objek yang dibuat berdasarkan sebuah class disebut sebagai...",options:["Instance","Package","Library","Compiler","Interface","Namespace"],correctIndex:0,explanation:"Objek merupakan instance dari class. Setiap objek memiliki keadaan (atribut) dan perilaku (method) sesuai definisi class-nya."},
  {category:"ENCAPSULATION",question:"Apa tujuan utama penerapan encapsulation dalam OOP?",options:["Menghapus seluruh method","Membuat semua atribut menjadi public","Menyembunyikan detail internal dan mengontrol akses data","Menggabungkan beberapa class menjadi satu file","Mempercepat koneksi jaringan","Mengubah bahasa pemrograman"],correctIndex:2,explanation:"Encapsulation membungkus data dan perilaku dalam satu unit serta membatasi akses langsung ke detail internal objek. Akses dapat dikendalikan melalui method seperti getter dan setter."},
  {category:"INHERITANCE",question:"Konsep ketika sebuah class dapat mewarisi atribut dan method dari class lain disebut...",options:["Abstraction","Overloading","Compilation","Inheritance","Instantiation","Encapsulation"],correctIndex:3,explanation:"Inheritance (pewarisan) memungkinkan class turunan memperoleh atribut dan method dari class induk sehingga kode dapat digunakan kembali dan hubungan antarkelas dapat dimodelkan."},
  {category:"POLYMORPHISM",question:"Makna polymorphism dalam pemrograman berorientasi objek adalah...",options:["Satu class harus memiliki satu objek","Objek tidak boleh memiliki method","Semua atribut harus bertipe sama","Program hanya dapat berjalan pada satu platform","Satu antarmuka dapat memiliki bentuk perilaku yang berbeda","Menghapus hubungan antarclass"],correctIndex:4,explanation:"Polymorphism berarti banyak bentuk. Method atau antarmuka yang sama dapat menghasilkan perilaku berbeda bergantung pada objek yang menjalankannya."},
  {category:"ABSTRACTION",question:"Abstraction dalam OOP berfokus pada...",options:["Menampilkan detail implementasi sebanyak mungkin","Menyembunyikan kompleksitas dan menampilkan hal-hal penting","Menggandakan seluruh kode program","Mengubah objek menjadi database","Menghilangkan seluruh atribut","Membatasi jumlah objek menjadi satu"],correctIndex:1,explanation:"Abstraction menyederhanakan penggunaan sistem dengan menampilkan fitur penting dan menyembunyikan detail implementasi yang tidak perlu diketahui pengguna."},
  {category:"METHOD",question:"Apa yang dimaksud dengan constructor pada sebuah class?",options:["Method yang dipanggil untuk menginisialisasi objek saat dibuat","Method untuk menghentikan sistem operasi","Atribut yang menyimpan nama class","Perintah untuk menghapus class induk","Method yang selalu mengembalikan boolean","File untuk menyimpan dokumentasi"],correctIndex:0,explanation:"Constructor adalah mekanisme khusus yang dijalankan ketika objek dibuat. Umumnya constructor digunakan untuk memberikan nilai awal pada atribut objek."},
  {category:"RELATIONSHIP",question:"Hubungan ketika satu class menggunakan atau memiliki objek dari class lain sebagai bagian dari strukturnya sering disebut...",options:["Recursion","Iteration","Composition","Compilation","Casting","Overriding"],correctIndex:2,explanation:"Composition adalah hubungan whole-part yang kuat: objek pemilik terdiri dari objek lain sebagai bagiannya. Siklus hidup bagian umumnya terkait dengan objek pemilik."},
  {category:"METHOD",question:"Jika subclass menyediakan implementasi baru untuk method yang sudah dimiliki superclass dengan signature yang sesuai, konsep ini disebut...",options:["Method hiding saja","Constructor chaining","Garbage collection","Method overriding","Encapsulation","Type casting"],correctIndex:3,explanation:"Method overriding terjadi ketika subclass mendefinisikan ulang implementasi method dari superclass. Ini sering digunakan untuk menerapkan polymorphism."},
  {category:"ACCESS MODIFIER",question:"Access modifier manakah yang umumnya membatasi akses anggota class agar hanya dapat diakses dari dalam class itu sendiri?",options:["public","protected","default","static","private","final"],correctIndex:4,explanation:"Modifier private membatasi akses anggota agar hanya dapat diakses langsung dari dalam class tempat anggota tersebut dideklarasikan. Ini membantu menjaga encapsulation."}
];

const optionLetters = ["A","B","C","D","E","F"];
let userName = "", userNim = "", currentQuestionIndex = 0, totalWrongAnswers = 0, totalCorrectAnswers = 0;
let wrongOptions = new Set();

const $ = id => document.getElementById(id);
const loginScreen=$("login-screen"), quizScreen=$("quiz-screen"), resultScreen=$("result-screen");
const loginForm=$("login-form"), inputNama=$("input-nama"), inputNim=$("input-nim"), loginError=$("login-error");
const feedbackModal=$("feedback-modal"), modalHeader=$("modal-header"), modalIcon=$("modal-icon");
const modalTitle=$("modal-title"), modalSubtitle=$("modal-subtitle"), modalBodyText=$("modal-body-text");
const modalActionBtn=$("modal-action-btn"), modalBtnText=$("modal-btn-text");

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  userName=inputNama.value.trim(); userNim=inputNim.value.trim();
  if(!userName || !userNim){loginError.hidden=false;(!userName?inputNama:inputNim).focus();return;}
  loginError.hidden=true; currentQuestionIndex=0; totalWrongAnswers=0; totalCorrectAnswers=0;
  $("display-nama").textContent=userName; $("display-nim").textContent=`NIM: ${userNim}`;
  $("wrong-counter-badge").textContent="0";
  loginScreen.hidden=true; resultScreen.hidden=true; quizScreen.hidden=false;
  renderQuestion();
});

function renderQuestion(){
  wrongOptions.clear();
  const data=quizData[currentQuestionIndex];
  $("current-question-num").textContent=currentQuestionIndex+1;
  $("question-step").textContent=`PERTANYAAN ${String(currentQuestionIndex+1).padStart(2,"0")}`;
  $("progress-bar").style.width=`${((currentQuestionIndex+1)/quizData.length)*100}%`;
  $("question-category").textContent=data.category;
  $("question-text").textContent=data.question;
  const container=$("options-container"); container.replaceChildren();
  data.options.forEach((option,index)=>{
    const button=document.createElement("button"); button.type="button"; button.className="option-btn";
    const letter=document.createElement("span"); letter.className="option-letter"; letter.textContent=optionLetters[index];
    const label=document.createElement("span"); label.textContent=option;
    button.append(letter,label); button.addEventListener("click",()=>handleAnswer(index,button));
    container.append(button);
  });
}

function handleAnswer(index,button){
  const data=quizData[currentQuestionIndex];
  if(index===data.correctIndex){
    totalCorrectAnswers++;
    button.style.borderColor="#9dcc70"; button.style.background="#f3faeb";
    button.querySelector(".option-letter").style.cssText="background:#8bc84d;color:#17321e";
    showModal(true,data.explanation);
  }else{
    if(!wrongOptions.has(index)){totalWrongAnswers++;wrongOptions.add(index);$("wrong-counter-badge").textContent=totalWrongAnswers;}
    button.disabled=true;button.classList.add("wrong");
    showModal(false,`Pilihan ${optionLetters[index]} belum tepat. Coba pahami kembali pertanyaan, lalu pilih jawaban lain.`);
  }
}

function showModal(isCorrect,message){
  modalHeader.classList.toggle("wrong-head",!isCorrect);
  modalIcon.textContent=isCorrect?"✓":"!";
  modalTitle.textContent=isCorrect?"Jawaban benar!":"Belum tepat";
  modalSubtitle.textContent=isCorrect?"PEMBAHASAN MATERI":"COBA SEKALI LAGI";
  modalBodyText.textContent=message;
  modalBtnText.textContent=isCorrect?(currentQuestionIndex===quizData.length-1?"Lihat hasil":"Lanjut ke soal berikutnya"):"Pilih jawaban lain";
  modalActionBtn.onclick=()=>{
    feedbackModal.hidden=true;
    if(!isCorrect)return;
    if(currentQuestionIndex===quizData.length-1)showResult();
    else{currentQuestionIndex++;renderQuestion();}
  };
  feedbackModal.hidden=false;modalActionBtn.focus();
}

function showResult(){
  quizScreen.hidden=true;resultScreen.hidden=false;
  $("result-nama").textContent=userName;$("result-nim").textContent=`NIM: ${userNim}`;
  $("result-correct-count").textContent=totalCorrectAnswers;
  $("result-wrong-count").textContent=totalWrongAnswers;
  const score=Math.round((totalCorrectAnswers/quizData.length)*100);
  $("result-score").textContent=score;
  $("result-feedback-box").textContent=score===100?"Luar biasa! Semua jawaban benar. Pemahaman konsep PBO kamu sangat baik.":score>=70?"Bagus! Kamu sudah memahami sebagian besar konsep PBO. Pelajari kembali materi pada soal yang masih keliru.":"Tetap semangat! Pelajari kembali class, object, dan empat pilar OOP, lalu coba kuis sekali lagi.";
}

$("btn-restart").addEventListener("click",()=>{
  inputNama.value="";inputNim.value="";currentQuestionIndex=0;totalWrongAnswers=0;totalCorrectAnswers=0;
  resultScreen.hidden=true;loginScreen.hidden=false;inputNama.focus();
});
feedbackModal.addEventListener("click",event=>{if(event.target===feedbackModal)return;});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!feedbackModal.hidden)feedbackModal.hidden=true;});
