const events = {
  neon:{name:"NEON TIDE",type:"ELECTRONIC · DAY 01",description:"A euphoric journey through melodic house, shimmering synths and golden-hour beats. Find your rhythm as the sky turns to colour.",time:"7:30 PM",stage:"Main Stage",day:"Saturday, 12 June"},
  moons:{name:"THE PAPER MOONS",type:"INDIE · DAY 01",description:"Dreamy guitars, honest lyrics and songs made for singing along. A warm, intimate set to ease you into the festival.",time:"5:00 PM",stage:"Dune Stage",day:"Saturday, 12 June"},
  sundown:{name:"SUNDOWN SOCIETY",type:"ELECTRONIC · DAY 02",description:"Deep rhythms and hypnotic energy that keep the night moving. Come ready for a high-voltage dance-floor moment.",time:"9:00 PM",stage:"Main Stage",day:"Sunday, 13 June"},
  wildflower:{name:"WILDFLOWER COLLECTIVE",type:"LIVE & CULTURE · DAY 02",description:"A vibrant live set blending folk textures, hand percussion and soul into a joyful celebration of sound.",time:"4:00 PM",stage:"Dune Stage",day:"Sunday, 13 June"},
  velvet:{name:"VELVET MORNINGS",type:"INDIE · DAY 02",description:"Feel-good indie pop, lush harmonies and a soundtrack for the last light of a perfect day.",time:"6:15 PM",stage:"Dune Stage",day:"Sunday, 13 June"},
  afterhours:{name:"AFTER HOURS",type:"ART & CULTURE · BOTH DAYS",description:"Wander through immersive light installations, interactive art and creative spaces. Something unexpected is always around the corner.",time:"2:00 PM onwards",stage:"Art Garden",day:"12–13 June"}
};
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const eventModal = $("#eventModal"), registerModal = $("#registerModal");
let selectedEvent = null;
function openModal(el){el.classList.add("open");el.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeModal(el){el.classList.remove("open");el.setAttribute("aria-hidden","true");document.body.style.overflow="";}
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal($("#"+b.dataset.close))));
[eventModal,registerModal].forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal(eventModal);closeModal(registerModal)}});

$$(".event-detail").forEach(btn=>btn.addEventListener("click",()=>{
  const ev=events[btn.dataset.event];selectedEvent=btn.dataset.event;
  $("#modalType").textContent=ev.type;$("#modalTitle").textContent=ev.name;$("#modalDescription").textContent=ev.description;
  $("#modalMeta").innerHTML=`<span>◷ ${ev.day} · ${ev.time}</span><span>✳ ${ev.stage}</span>`;
  openModal(eventModal);
}));
function openRegistration(ticket="", eventName=""){
  closeModal(eventModal);
  $("#registrationForm").hidden=false;$("#successMessage").hidden=true;
  $("#ticketSelect").value=ticket;
  if(eventName){$("#registerTitle").innerHTML=`YOU'RE BOOKING<br><span class="gradient-text">${eventName}.</span>`;}
  else{$("#registerTitle").innerHTML=`LET'S GET<br><span class="gradient-text">YOU THERE.</span>`;}
  openModal(registerModal);
}
$("#modalRegister").addEventListener("click",()=>openRegistration("Weekend Pass",events[selectedEvent]?.name||""));
$$(".register-trigger").forEach(b=>b.addEventListener("click",()=>openRegistration(b.dataset.ticket)));
$("#registrationForm").addEventListener("submit",e=>{
  e.preventDefault();const form=e.currentTarget;
  if(!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form).entries());
  if(!/^[0-9]{10}$/.test(data.phone)){showToast("Please enter a valid 10-digit phone number.");return;}
  const registrations=JSON.parse(localStorage.getItem("afterglowRegistrations")||"[]");
  registrations.push({...data,registeredAt:new Date().toISOString()});
  localStorage.setItem("afterglowRegistrations",JSON.stringify(registrations));
  $("#successText").textContent=`Thanks, ${data.name}! Your ${data.ticket} registration has been saved on this device.`;
  form.hidden=true;$("#successMessage").hidden=false;
});
$("#closeSuccess").addEventListener("click",()=>{closeModal(registerModal);showToast("See you in the golden hour ✳");});

const search=$("#eventSearch");let activeFilter="all";
function filterEvents(){
  const q=search.value.toLowerCase().trim();let visible=0;
  $$(".event-card").forEach(card=>{
    const matchesCategory=activeFilter==="all"||card.dataset.category===activeFilter;
    const matchesSearch=card.dataset.search.includes(q)||card.innerText.toLowerCase().includes(q);
    const show=matchesCategory&&matchesSearch;card.hidden=!show;if(show)visible++;
  });
  $("#noResults").hidden=visible!==0;
}
search.addEventListener("input",filterEvents);
$$(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>{activeFilter=btn.dataset.filter;$$(".filter-btn").forEach(b=>b.classList.toggle("active",b===btn));filterEvents()}));

$("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("light");$("#themeToggle").textContent=document.body.classList.contains("light")?"☾":"☼";localStorage.setItem("afterglowTheme",document.body.classList.contains("light")?"light":"dark")});
if(localStorage.getItem("afterglowTheme")==="light"){document.body.classList.add("light");$("#themeToggle").textContent="☾";}
$("#menuToggle").addEventListener("click",()=>{const nav=$("#nav"),open=nav.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));$("#menuToggle").textContent=open?"×":"☰"});
$$(".nav a").forEach(a=>a.addEventListener("click",()=>{$("#nav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");$("#menuToggle").textContent="☰"}));

const targetDate=new Date("2027-06-12T14:00:00+05:30").getTime();
function updateCountdown(){
  let diff=targetDate-Date.now();if(diff<0){$("#countdown").innerHTML="<strong>THE FESTIVAL IS ON ✳</strong>";return;}
  const d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);
  $("#days").textContent=String(d).padStart(3,"0");$("#hours").textContent=String(h).padStart(2,"0");$("#minutes").textContent=String(m).padStart(2,"0");$("#seconds").textContent=String(s).padStart(2,"0");
}
updateCountdown();setInterval(updateCountdown,1000);
let toastTimer;function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2600);}
