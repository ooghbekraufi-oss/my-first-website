
"use strict";

/* Leo Leo Hub — browser-only demonstration. Playback uses public sample media. */
const base = "https://storage.googleapis.com/gtv-videos-bucket/sample/";
const imageBase = "https://images.unsplash.com/";
const videos = [
 {id:1,title:"Big Buck Bunny — دنیای شگفت‌انگیز انیمیشن",channel:"Blender Showcase",category:"انیمیشن",views:"۲.۴ میلیون",date:"امروز",duration:"09:56",photo:"photo-1470770841072-f978cf4d019e",file:"BigBuckBunny.mp4",avatar:"BB",color:"#673ab7"},
 {id:2,title:"Sintel — یک داستان سینمایی و پرماجرا",channel:"Cinema Planet",category:"فیلم",views:"۸۷۶ هزار",date:"۲ روز پیش",duration:"14:48",photo:"photo-1446776811953-b23d57bd21aa",file:"Sintel.mp4",avatar:"CP",color:"#dd456c"},
 {id:3,title:"Elephants Dream — سفر به دنیای خیال",channel:"Motion Lab",category:"انیمیشن",views:"۵۴۰ هزار",date:"۳ روز پیش",duration:"10:53",photo:"photo-1518770660439-4636190af475",file:"ElephantsDream.mp4",avatar:"ML",color:"#4c79b9"},
 {id:4,title:"Tears of Steel — داستانی از آینده",channel:"Future Frame",category:"تکنالوژی",views:"۱.۸ میلیون",date:"۱ هفته پیش",duration:"12:14",photo:"photo-1519389950473-47ba0277781c",file:"TearsOfSteel.mp4",avatar:"FF",color:"#405ac2"},
 {id:5,title:"For Bigger Joyrides — هیجان در مسیر",channel:"Travel Vibes",category:"سفر",views:"۲۳۸ هزار",date:"۴ روز پیش",duration:"00:15",photo:"photo-1500534623283-312aade485b7",file:"ForBiggerJoyrides.mp4",avatar:"TV",color:"#1f968a"},
 {id:6,title:"For Bigger Escapes — فرار به طبیعت",channel:"Wild Journeys",category:"سفر",views:"۳۹۴ هزار",date:"۶ روز پیش",duration:"00:15",photo:"photo-1464822759023-fed622ff2c3b",file:"ForBiggerEscapes.mp4",avatar:"WJ",color:"#7366c4"},
 {id:7,title:"For Bigger Fun — یک لحظه سرگرم‌کننده",channel:"Game Station",category:"سرگرمی",views:"۷۱۲ هزار",date:"دیروز",duration:"00:15",photo:"photo-1493711662062-fa541adb3fc8",file:"ForBiggerFun.mp4",avatar:"GS",color:"#cc4879"},
 {id:8,title:"For Bigger Blazes — نور و تصویر",channel:"Creative Studio",category:"فیلم",views:"۱۲۷ هزار",date:"۵ روز پیش",duration:"00:15",photo:"photo-1485846234645-a62644f84728",file:"ForBiggerBlazes.mp4",avatar:"CS",color:"#ac5e33"},
 {id:9,title:"For Bigger Meltdowns — سینمای کوتاه",channel:"Frame Works",category:"فیلم",views:"۴۵۹ هزار",date:"۱ هفته پیش",duration:"00:15",photo:"photo-1489599849927-2ee91cede3ba",file:"ForBiggerMeltdowns.mp4",avatar:"FW",color:"#8c4bbb"}
];
const categories = ["همه","انیمیشن","فیلم","تکنالوژی","سفر","سرگرمی"];
const $ = (s,root=document) => root.querySelector(s);
const $$ = (s,root=document) => [...root.querySelectorAll(s)];
const icon = (name) => '<svg class="icon" aria-hidden="true"><use href="#i-'+name+'"></use></svg>';
function loadSet(name) {try {return new Set(JSON.parse(localStorage.getItem("leo_"+name)||"[]"));} catch (_) {return new Set();}}
function persist(name,set) {try {localStorage.setItem("leo_"+name,JSON.stringify([...set]));} catch(_){}}
const saved=loadSet("saved"), liked=loadSet("liked"), watched=loadSet("watched"), subscribed=loadSet("subscribed");
const state={nav:"home",category:"همه",query:"",current:null};
let toastTimeout=null;
function toast(message){
 const el=$("#toast");el.textContent=message;el.classList.add("visible");
 clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove("visible"),2600);
}
function setNavigation(nav){
 state.nav=nav;state.category="همه";
 $$(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.nav===nav));
 const titles={home:"ویدیوهای پیشنهادی",explore:"ویدیوها را کشف کن",trending:"داغ‌ترین ویدیوها",saved:"ویدیوهای ذخیره‌شده",history:"تاریخچه تماشا",subscriptions:"کانال‌های دنبال‌شده"};
 $("#section-title").textContent=titles[nav]||titles.home;
 $("#section-subtitle").textContent=nav==="home"?"ویدیوهای نمونه را ببین و محیط سایت را تجربه کن":"این بخش در مرورگرت به‌صورت آزمایشی کار می‌کند";
 $("#sidebar").classList.remove("open");
 render();
 document.getElementById("explore-section").scrollIntoView({behavior:"smooth",block:"start"});
}
function videoList(){
 let list=videos.slice();
 if(state.nav==="trending") list=[videos[0],videos[3],videos[1],videos[6],videos[2],videos[8]];
 if(state.nav==="saved") list=list.filter(v=>saved.has(v.id));
 if(state.nav==="history") list=list.filter(v=>watched.has(v.id));
 if(state.nav==="subscriptions") list=list.filter(v=>subscribed.has(v.channel));
 if(state.category!=="همه") list=list.filter(v=>v.category===state.category);
 const query=state.query.trim().toLocaleLowerCase();
 if(query)list=list.filter(v=>[v.title,v.channel,v.category].join(" ").toLocaleLowerCase().includes(query));
 return list;
}
function renderCategories(){
 $("#categories").innerHTML=categories.map(c=>'<button class="chip '+(c===state.category?"active":"")+'" type="button" data-category="'+c+'">'+c+'</button>').join("");
}
function renderCard(v){
 const image=imageBase+v.photo+"?auto=format&fit=crop&w=850&q=85";
 return [
 '<article class="video-card" role="button" tabindex="0" aria-label="پخش '+v.title+'" data-video="'+v.id+'">',
 '<div class="thumb">',
 '<img src="'+image+'" alt="تصویر نمایشی ویدیو" loading="lazy" />',
 '<button class="card-fav '+(saved.has(v.id)?"saved":"")+'" data-save="'+v.id+'" type="button" aria-label="ذخیره ویدیو" aria-pressed="'+saved.has(v.id)+'">'+icon("bookmark")+'</button>',
 '<div class="play-circle">'+icon("play")+'</div><span class="duration">'+v.duration+'</span></div>',
 '<div class="video-info"><div class="channel-avatar" style="--avatar:'+v.color+'">'+v.avatar+'</div>',
 '<div class="video-copy"><h3>'+v.title+'</h3>',
 '<p>'+v.channel+' <span class="verify">●</span></p>',
 '<p>'+v.views+' بازدید · '+v.date+'</p></div></div></article>'
 ].join("");
}
function render(){
 renderCategories();
 const list=videoList();
 $("#video-grid").innerHTML=list.map(renderCard).join("");
 $("#empty").classList.toggle("visible",list.length===0);
 const messages={saved:"هنوز ویدیویی را ذخیره نکردی.",history:"هنوز ویدیویی تماشا نکردی.",subscriptions:"هنوز کانالی را دنبال نکردی."};
 $("#empty-text").textContent=state.query?"برای جست‌وجوی تو ویدیویی پیدا نشد.":messages[state.nav]||"در این دسته ویدیویی موجود نیست.";
 $("#video-count").textContent=list.length.toLocaleString("fa-AF")+" ویدیو";
}
function toggleSave(id){
 if(saved.has(id)){saved.delete(id);toast("از ویدیوهای ذخیره‌شده حذف شد");}
 else{saved.add(id);toast("ویدیو ذخیره شد");}
 persist("saved",saved);render();
 if(state.current===id)updateActions();
}
function updateActions(){
 const v=videos.find(v=>v.id===state.current);
 if(!v)return;
 const like=$("#like-btn"),save=$("#save-btn"),sub=$("#subscribe-btn");
 like.classList.toggle("selected",liked.has(v.id));save.classList.toggle("selected",saved.has(v.id));sub.classList.toggle("selected",subscribed.has(v.channel));
 like.innerHTML=icon("heart")+(liked.has(v.id)?"پسندیده شد":"پسندیدن");
 save.innerHTML=icon("bookmark")+(saved.has(v.id)?"ذخیره شد":"ذخیره");
 sub.innerHTML=icon("check")+(subscribed.has(v.channel)?"دنبال می‌کنی":"دنبال‌کردن کانال");
}
function openPlayer(id){
 const v=videos.find(v=>v.id===id);
 if(!v)return;
 state.current=id;
 watched.add(id);persist("watched",watched);
 $("#player-title").textContent=v.title;
 $("#player-by").textContent=v.channel+" · ویدیوی نمونه · "+v.views+" بازدید";
 const player=$("#video-player");
 player.src=base+encodeURIComponent(v.file);
 player.poster=imageBase+v.photo+"?auto=format&fit=crop&w=1280&q=85";
 $("#player-overlay").classList.add("open");
 $("#player-overlay").setAttribute("aria-hidden","false");
 document.body.style.overflow="hidden";
 $("#player-error").hidden=true;
 updateActions();player.play().catch(()=>{});
 $("#close-player").focus();
}
function closePlayer(){
 const player=$("#video-player");player.pause();player.removeAttribute("src");player.load();
 $("#player-overlay").classList.remove("open");$("#player-overlay").setAttribute("aria-hidden","true");
 document.body.style.overflow="";
 state.current=null;render();
}
function openUpload(){
 $("#upload-overlay").classList.add("open");$("#upload-overlay").setAttribute("aria-hidden","false");
 document.body.style.overflow="hidden";$("#close-upload").focus();
}
function closeUpload(){
 $("#upload-overlay").classList.remove("open");$("#upload-overlay").setAttribute("aria-hidden","true");document.body.style.overflow="";
}
$("#video-grid").addEventListener("click",e=>{
 const saveBtn=e.target.closest("[data-save]");
 if(saveBtn){e.stopPropagation();toggleSave(Number(saveBtn.dataset.save));return;}
 const card=e.target.closest("[data-video]");if(card)openPlayer(Number(card.dataset.video));
});
$("#video-grid").addEventListener("keydown",e=>{
 if(e.target.closest("[data-save]"))return;
 const card=e.target.closest("[data-video]");
 if(card&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openPlayer(Number(card.dataset.video));}
});
$("#video-grid").addEventListener("pointermove",e=>{
 if(e.pointerType==="touch")return;
 const card=e.target.closest(".video-card");if(!card)return;
 const b=card.getBoundingClientRect();let x=((e.clientX-b.left)/b.width-.5)*2;let y=((e.clientY-b.top)/b.height-.5)*2;
 card.style.setProperty("--rx",(-y*5)+"deg");card.style.setProperty("--ry",(x*5)+"deg");
});
$("#video-grid").addEventListener("pointerout",e=>{
 const card=e.target.closest(".video-card");if(card&&!card.contains(e.relatedTarget)){card.style.setProperty("--rx","0deg");card.style.setProperty("--ry","0deg");}
});
$("#categories").addEventListener("click",e=>{const chip=e.target.closest("[data-category]");if(chip){state.category=chip.dataset.category;render();}});
$$("[data-nav]").forEach(btn=>btn.addEventListener("click",e=>{e.preventDefault();setNavigation(btn.dataset.nav);}));
$("#search-input").addEventListener("input",e=>{state.query=e.target.value;render();});
$("#featured-btn").addEventListener("click",()=>openPlayer(1));
$("#browse-btn").addEventListener("click",()=>setNavigation("explore"));
$("#show-all").addEventListener("click",()=>{state.query="";$("#search-input").value="";setNavigation("home");});
$("#mobile-menu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#mobile-search").addEventListener("click",()=>{$(".top-search").classList.toggle("mobile-visible");$("#search-input").focus();});
$("#upload-btn").addEventListener("click",openUpload);
$("#close-upload").addEventListener("click",closeUpload);
$("#close-player").addEventListener("click",closePlayer);
$("#player-overlay").addEventListener("click",e=>{if(e.target.id==="player-overlay")closePlayer();});
$("#upload-overlay").addEventListener("click",e=>{if(e.target.id==="upload-overlay")closeUpload();});
$("#like-btn").addEventListener("click",()=>{const id=state.current;if(id===null)return;if(liked.has(id))liked.delete(id);else liked.add(id);persist("liked",liked);updateActions();});
$("#save-btn").addEventListener("click",()=>{if(state.current!==null)toggleSave(state.current);});
$("#subscribe-btn").addEventListener("click",()=>{const v=videos.find(v=>v.id===state.current);if(!v)return;if(subscribed.has(v.channel))subscribed.delete(v.channel);else subscribed.add(v.channel);persist("subscribed",subscribed);updateActions();});
$("#video-player").addEventListener("error",()=>{$("#player-error").hidden=false;});
$("#notifications-btn").addEventListener("click",()=>toast("این بخش در نسخه بعدی اضافه می‌شود"));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if($("#player-overlay").classList.contains("open"))closePlayer();if($("#upload-overlay").classList.contains("open"))closeUpload();}});
render();
