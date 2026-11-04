document.documentElement.classList.add('js');
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Data ---------- */
const SPECS=[
 {n:'Cardiology',d:'The largest cardiology network in the US with over 50 boarded cardiologists practicing in 30+ locations nationwide.',p:'Photo: cardiology exam'},
 {n:'Dental',d:'One of our most rapidly growing networks, with dental specialists across the country. Residency opportunities available!',p:'Photo: dental exam'},
 {n:'Surgery',d:'Surgery centers are actively being built and will be led by board-certified surgery specialists.',p:'Photo: surgery patient'},
 {n:'Ophthalmology',d:'With multiple ophthalmology services across growing metro areas, we are building ophthalmology access nationally.',p:'Photo: eye exam'},
 {n:'Oncology',d:'Designed to meet the demand for oncology specialists, our practices offer specialist-led cutting-edge oncologic care.',p:'Photo: oncology care'},
 {n:'Internal Medicine',d:'We are building outpatient internal medicine practices from the ground up to offer increased access for our patients.',p:'Photo: internal medicine'}
];
const NAV_ORDER=['Cardiology','Dental','Surgery','Ophthalmology','Oncology','Internal Medicine'];
const slug=n=>n.toLowerCase().replace(/\s+/g,'-');
const BUILT=['Cardiology','Dental','Surgery','Ophthalmology','Internal Medicine','Oncology'];
const specHref=n=>BUILT.includes(n)?'#'+slug(n):'#home';
$('#specnav').innerHTML=NAV_ORDER.map(n=>`<a href="${specHref(n)}" ${BUILT.includes(n)?`data-nav="${slug(n)}"`:`data-spec="${n}"`}>${n}</a>`).join('');

/* ---------- Toast ---------- */
let tt;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),3200)}
document.addEventListener('click',e=>{
  const s=e.target.closest('[data-spec]');
  if(s){e.preventDefault();toast(`The ${s.dataset.spec} page isn’t part of this prototype yet.`);return}
  const d=e.target.closest('[data-toast]');
  if(d){e.preventDefault();toast(d.dataset.toast)}
});

/* ---------- Carousels ---------- */
$$('[data-expertise]').forEach(host=>{
  host.innerHTML=`<div class="track" tabindex="0" aria-label="Specialties">${SPECS.map(s=>`
    <article class="xcard"><div class="ph ph-dark"><span class="ph-label"><svg><use href="#cam"/></svg>${s.p}</span></div>
      <div class="body"><h3>${s.n}</h3><p>${s.d}</p>
      <a class="btn btn-gold" href="${specHref(s.n)}" ${BUILT.includes(s.n)?'':`data-spec="${s.n}"`}>Explore</a></div></article>`).join('')}</div>
    <div class="dots" role="tablist" aria-label="Choose specialty">${SPECS.map((s,i)=>`<button class="dot" aria-label="${s.n}" data-i="${i}"></button>`).join('')}</div>`;
  const arrows=host.parentElement.querySelector('[data-arrows]');
  arrows.innerHTML=`<button class="arrow" aria-label="Previous"><svg><use href="#chevl"/></svg></button><button class="arrow" aria-label="Next"><svg><use href="#chev"/></svg></button>`;
  const track=$('.track',host), cards=$$('.xcard',host), dots=$$('.dot',host), [prev,next]=$$('.arrow',arrows);
  const step=()=>cards[0].offsetWidth+24;
  const update=()=>{
    const max=track.scrollWidth-track.clientWidth;
    let i=Math.round(track.scrollLeft/step());
    if(track.scrollLeft>=max-4)i=cards.length-1;
    dots.forEach((d,k)=>d.setAttribute('aria-current',k===i?'true':'false'));
    prev.disabled=track.scrollLeft<4; next.disabled=track.scrollLeft>=max-4;
  };
  prev.onclick=()=>track.scrollBy({left:-step(),behavior:'smooth'});
  next.onclick=()=>track.scrollBy({left:step(),behavior:'smooth'});
  dots.forEach(d=>d.onclick=()=>track.scrollTo({left:d.dataset.i*step(),behavior:'smooth'}));
  track.addEventListener('scroll',()=>requestAnimationFrame(update),{passive:true});
  track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();next.click()}if(e.key==='ArrowLeft'){e.preventDefault();prev.click()}});
  // drag to scroll (mouse)
  let down=false,sx=0,sl=0,moved=false;
  track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=track.scrollLeft});
  window.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;track.classList.add('dragging')}track.scrollLeft=sl-dx});
  window.addEventListener('pointerup',()=>{if(!down)return;down=false;track.classList.remove('dragging');if(moved){const i=Math.round(track.scrollLeft/step());track.scrollTo({left:i*step(),behavior:'smooth'})}});
  track.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
  addEventListener('resize',update);
  host._update=update;
});


/* ---------- Specialty pages (one shared template) ---------- */
const ICONS={
 autonomy:'<path d="M12 6v12a8 8 0 0 0 16 0V6"/><path d="M20 26v6a8 8 0 0 0 16 0v-4"/><circle cx="36" cy="24" r="4"/><path d="M9 6h6M25 6h6"/>',
 tech:'<rect x="14" y="8" width="28" height="20" rx="2"/><path d="M18 18h5l2-4 3 8 2-4h8M24 28v6M20 34h12"/><rect x="6" y="22" width="12" height="18" rx="2"/><path d="M12 28v6M9 31h6"/>',
 learn:'<path d="M30 8H11a2 2 0 0 0-2 2v28a2 2 0 0 0 2 2h22a2 2 0 0 0 2-2V24"/><path d="M14 16h11M14 22h9M14 28h6M14 34h10"/><path d="M38.5 7.5a2.6 2.6 0 0 1 3.7 3.7L28 25.4l-5 1.3 1.3-5z"/><path d="m35.5 10.5 3.7 3.7"/>',
 support:'<circle cx="24" cy="12" r="4.5"/><circle cx="11.5" cy="17" r="3.5"/><circle cx="36.5" cy="17" r="3.5"/><path d="M16 31v-2a8 8 0 0 1 16 0v2"/><path d="M5 31v-1a6.5 6.5 0 0 1 10-5.5M43 31v-1a6.5 6.5 0 0 0-10-5.5"/><path d="M4 35.5c3 0 5 1.5 8 3.5h6.5a2.5 2.5 0 0 0 0-5H14"/><path d="M44 35.5c-3 0-5 1.5-8 3.5h-6.5a2.5 2.5 0 0 1 0-5H34"/>',
 network:'<circle cx="24" cy="10" r="4"/><path d="M18 22a6 6 0 0 1 12 0"/><circle cx="12" cy="30" r="4"/><path d="M6 42a6 6 0 0 1 12 0"/><circle cx="36" cy="30" r="4"/><path d="M30 42a6 6 0 0 1 12 0M24 22v4M24 26l-8 2M24 26l8 2"/>',
 careers:'<path d="M6 20v10c0 4 3 8 8 10h4v-8l-6-6M42 20v10c0 4-3 8-8 10h-4v-8l6-6"/><path d="M24 26s-6-3.5-6-7.5A3.5 3.5 0 0 1 24 16a3.5 3.5 0 0 1 6 2.5c0 4-6 7.5-6 7.5z"/><path d="M14 10l2 2M34 10l-2 2M24 6v3"/>'
};
const BENEFITS=['Medical and Dental Insurance','Vision Insurance','Paid Time Off','CE Allowance','Disability Insurance','Professional Fees Covered <span class="fine">(AVDC, VDF, AVD)</span>','Licensure Reimbursement','401(k) Match','DEA Covered','Parental Leave'];
const SUPPORT='Your dedicated field support team understands your opportunities and challenges because they are working side by side with you.';
const NETWORK='Access a team ready to collaborate and consult on cases, provide support and mentorship, and help you on your path to success.';
const FULFIL='Support to deliver amazing care including robust compensation and benefits, flexible schedule (no nights, weekends, or on-call shifts), leadership opportunities, collaborative culture, and more.';
const TECH='Our imaging and technology are top-of-the-line. We constantly assess new technologies and equipment, so you have the very best available.';
const learn=w=>`We nurture a continuous learning culture, even for our tenured ${w}. Along with CE, you’ll serve as an investigator in clinical trials, participate in mentorship, and develop leadership skills.`;
const PAGES=[
 {name:'Cardiology',heroPh:'Photo: cardiologist with Pomeranian',caringPh:'Photo: cardiologist with Pomeranian',
  title:'Join the Leader in Veterinary Cardiology',
  intro:'As the largest, most respected veterinary outpatient cardiology network in the nation, CVCA Cardiac Care for Pets has 30+ locations and 50+ boarded cardiologists, along with one of the most sought-after residency programs in veterinary cardiology.',
  network:true,vTitle:'Inside CVCA',vLabel:'CVCA video',vSub:'Experience a day in the life with CVCA’s leading veterinary cardiologists.',
  stats:[[30,'+','Locations'],[12,'','States'],[50,'+','Veterinary cardiologists']],
  who:'cardiologists',
  adv:[['Clinical Autonomy','You practice your way. Your diagnostics, your treatment plan, your patients, your local referral community.'],
       ['Advanced Technology','Our imaging and technology are the same ones used for human cardiology—top-of-the-line. We are always evaluating emerging technology to support our teams and improve care to patients.'],
       ['Continuous Learning','We nurture a continuous learning culture, even for our tenured cardiologists. Along with CE, you’ll serve as an investigator in cutting-edge clinical trials, participate in mentorship, and develop leadership skills to further grow your own team.'],
       ['Dedicated Support',SUPPORT],['Large Cardiologist Network',NETWORK],['Fulfilling Careers',FULFIL]],
  cta:'Whether you’re a board-certified specialist or pursuing advanced training, discover opportunities to grow your career and make a meaningful impact in veterinary medicine.'},
 {name:'Dental',heroPh:'Photo: dentist examining dog',caringPh:'Photo: vet with white dog',
  title:'Join Our Growing Veterinary Dental Network',
  intro:'Build the life you want as a veterinary dentist with Mission Specialty. We offer dentists the support to deliver patient care at the highest standard, along with a fulfilling life on your terms.',
  vTitle:'A Dental Network Built and Led by Specialty Professionals',vLabel:'Dental video',
  vSub:'At Mission Specialty, Dental and Oral Surgery is a critical area of focus, not just a service add-on in a large clinic. Our AVDC-boarded doctors work in hospitals built to deliver advanced oral surgery and care, equipped with advanced technology and support staff for dental services.',
  who:'dentists and oral surgeons',
  adv:[['Clinical Autonomy','You practice your way. Your diagnostics, your treatment plan, your patients, your local referral community.'],
       ['Advanced Technology','Our imaging and technology are the best of their kind, including cone-beam CT and advanced equipment. We are always evaluating emerging technology to support our teams and improve care to patients.'],
       ['Continuous Learning','We nurture a continuous learning culture, even for our tenured dentists. Along with CE, you’ll participate in mentorship and develop leadership skills to further grow your own team.'],
       ['Dedicated Support',SUPPORT],['Large Dental Specialist Network',NETWORK],['Fulfilling Careers',FULFIL]],
  cta:'Whether you’re a board-certified specialist or pursuing advanced training, discover opportunities to grow your career and make a meaningful impact in veterinary medicine.'},
 {name:'Surgery',heroPh:'Photo: surgeon in the OR',caringPh:'Photo: vet reviewing X-ray with cat',
  title:'Build the Life You Want as a Veterinary Surgeon',
  intro:'At Mission Specialty, we foster happy, collaborative teams across specialties because exceptional patient care follows. Join our network of boarded veterinary surgeons and practice alongside colleagues who share your standards, with the support to shape your career on your terms.',
  vTitle:'Build a Successful, Lasting Surgical Career',vLabel:'Surgery video',
  vSub:'We’re here to support your success with purpose-built surgery centers and a dedicated specialty infrastructure. You have complete clinical autonomy and are empowered to lead your hospital your way to create the career you envision.',
  who:'surgeons',
  adv:[['Clinical Autonomy','You practice your way. Your surgery protocol, your recovery plan, your patients, your local referral community.'],
       ['Advanced Technology','Our imaging and technology are the top grade of their kind. We are always evaluating emerging technology to support our teams and improve care to patients.'],
       ['Continuous Learning','We nurture a continuous learning culture, even for our tenured surgeons. Along with CE, you’ll participate in mentorship and develop leadership skills to further grow your own team.'],
       ['Dedicated Support',SUPPORT],['Large Network of Surgeons',NETWORK],['Fulfilling Careers',FULFIL]],
  cta:'Whether you’re a board-certified specialist or pursuing advanced training, discover opportunities to grow your career and make a meaningful impact in veterinary medicine.'},
 {name:'Ophthalmology',heroPh:'Photo: eye exam with cat',caringPh:'Photo: vet with Bengal cat',
  title:'Our Ophthalmology Network is Growing—Join Us',
  intro:'We’re building the best network for boarded veterinary ophthalmologists in the nation. At Mission Specialty, we’re dedicated to ensuring the success of our ophthalmologists, their teams, and their hospitals.',
  vTitle:'Build Your Success with Mission Specialty',vLabel:'Ophthalmology video',
  vSub:'Mission Specialty gives you the resources and space to thrive, and more importantly, to create the kind of life you want as an ophthalmologist. That means you have complete clinical autonomy, and you lead your hospital your way. We’re here to support you as you create a lasting career for years to come.',
  who:'ophthalmologists',
  adv:[['Clinical Autonomy','You practice ophthalmology your way. Your diagnostics, your treatment plan, your patients, your local referral community.'],
       ['Advanced Technology','Our imaging and technology are top-of-the-line. We are always evaluating emerging technology to support our teams and improve care to patients.'],['Continuous Learning','We nurture a continuous learning culture, even for our tenured ophthalmologists. Along with CE, you’ll serve as an investigator in clinical trials, participate in mentorship, and develop leadership skills to further grow your own team.'],
       ['Dedicated Support',SUPPORT],['Large Ophthalmologist Network',NETWORK],['Fulfilling Careers',FULFIL]],
  cta:'Whether you’re a board-certified specialist or pursuing advanced training, discover opportunities to grow your career and make a meaningful impact in veterinary medicine.'},
 {name:'Internal Medicine',heroPh:'Photo: internist examining cat',caringPh:'Photo: vet examining white dog',
  title:'Build a Lasting Career as a Veterinary Internist',
  intro:'At Mission Specialty, we’re creating a network of boarded veterinary internists that is specialist-focused and backed by resources that help you to thrive. We know that when veterinary internal medicine teams are supported and happy, they can deliver exceptional, personalized patient care.',
  vTitle:'Internal Medicine at the Forefront',vLabel:'Internal medicine video',
  vSub:'Many times internal medicine teams are confronted with challenging cases but are hampered by shared diagnostic equipment and hospital protocols that are not built for them. Mission Specialty sees internal medicine differently. We give internists the space and resources needed for complex work. And we put you in the driver’s seat of delivering high-level patient care.',
  who:'internists',
  adv:[['Clinical Autonomy','You practice internal medicine your way. Your diagnostics, your treatment plan, your patients, your local referral community.'],
       ['Advanced Technology','Our imaging and technology are top-of-the-line. We are always evaluating emerging technology to support our teams and improve care to patients.'],['Continuous Learning','We nurture a continuous learning culture, even for our tenured internists. Along with CE, you’ll serve as an investigator in clinical trials, participate in mentorship, and develop leadership skills to further grow your own team.'],
       ['Dedicated Support',SUPPORT],['Large Internal Medicine Network',NETWORK],['Fulfilling Careers',FULFIL]],
  cta:'Whether you’re a board-certified specialist or pursuing advanced training, discover opportunities to grow your career and make a meaningful impact in veterinary medicine.'},
 {name:'Oncology',heroPh:'Photo: oncologist examining dog',caringPh:'Photo: vet examining cat',
  title:'Join the Leading Network for Veterinary Oncologists',
  intro:'We know that cancer care is a demanding and challenging specialty. It requires dedicated resources, committed support, and collaborative care. Mission Specialty is creating a network for oncologists that supports your work and your life outside of it.',
  vTitle:'Support for Successful Oncology Careers',vLabel:'Oncology video',
  vSub:'Top-level veterinary oncology requires specialized resources and support. That’s where Mission Specialty comes in. We are specialist-focused and are here to back you in the critical care you provide for your patients.',
  who:'oncologists',
  adv:[['Clinical Autonomy','You practice oncology your way. Your diagnostics, your treatment plan, your patients, your local referral community.'],
       ['Advanced Technology','Our imaging and technology are top-of-the-line. We are always evaluating emerging technology to support our teams and improve care to patients.'],['Continuous Learning','We nurture a continuous learning culture, even for our tenured oncologists. Along with CE, you’ll serve as an investigator in clinical trials, participate in mentorship, and develop leadership skills to further grow your own team.'],
       ['Dedicated Support',SUPPORT],['Large Oncology Network',NETWORK],['Fulfilling Careers',FULFIL]],
  cta:'Whether you’re a board-certified specialist or pursuing advanced training, discover opportunities to grow your career and make a meaningful impact in veterinary medicine.'}
];
const NETWORK_BAND=`<section class="netband" aria-labelledby="netband-t"><div class="wrap netband-in">
  <h2 class="netband-title rv" id="netband-t">Part of the Mission<br>Specialty Network</h2>
  <ul class="netlogos">${[1,2,3,4,5].map(i=>`<li class="rv" style="--d:${(i-1)*.07}s"><span class="logo-slot"><svg aria-hidden="true"><use href="#paw"/></svg>Partner logo ${i}</span></li>`).join('')}</ul>
</div></section>`;
const ICON_ORDER=['autonomy','tech','learn','support','network','careers'];
const cam='<svg><use href="#cam"/></svg>';
$('#specpages').outerHTML=PAGES.map(d=>`
<section data-view="${slug(d.name)}" hidden>
  <div class="spec-banner">
    <div class="lockup hero-anim"><svg><use href="#shield"/></svg><div><div class="n">Mission Specialty</div><div class="s">${d.name.toUpperCase()}</div></div></div>
    <div class="ph"><span class="ph-label">${cam}${d.heroPh}</span></div>
  </div>
  <section class="sec navy">
    <div class="wrap">
      <div class="intro-split">
        <h2 class="rv">${d.title}</h2>
        <div class="rv${d.name!=='Cardiology'?' align-x':''}" style="--d:.1s"><p style="margin-bottom:28px">${d.intro}</p>
          <div class="btn-row"><a class="btn btn-gold" href="#contact">Explore Careers</a><a class="btn btn-gold-line" href="#contact">Explore Residency</a></div></div>
      </div>
      <div class="cvca">
        <button class="ph ph-dark rv" data-video="${d.vTitle}" aria-label="Play video: ${d.vTitle}"><span class="ph-label">${cam}${d.vLabel} (16:9)</span><span class="play"><svg><use href="#play"/></svg></span></button>
        <div>
          <h2 class="rv">${d.vTitle}</h2>
          ${d.stats?`<p class="sub rv">${d.vSub}</p><div class="mini-stats">${d.stats.map((st,i)=>`<div class="rv" style="--d:${i*.08}s"><div class="num" data-count="${st[0]}" data-suffix="${st[1]}">${st[0]}${st[1]}</div><div class="lbl">${st[2]}</div></div>`).join('')}</div>`
                   :`<p class="copy rv" style="--d:.06s;margin-top:20px">${d.vSub}</p>`}
        </div>
      </div>
    </div>
  </section>
  ${d.network?NETWORK_BAND:''}
  <section class="sec alt">
    <div class="wrap">
      <div class="adv-head"><h2 class="rv">The Mission Specialty Advantage</h2><p class="rv" style="--d:.08s">Discover why the top veterinary ${d.who} choose to work with us.</p></div>
      <div class="adv">${d.adv.map((a,i)=>`<div class="adv-item rv" style="--d:${(i%2)*.08}s"><div class="tile"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[ICON_ORDER[i]]}</svg></div><div><h3>${a[0]}</h3><p>${a[1]}</p></div></div>`).join('')}</div>
    </div>
  </section>
  <section class="sec">
    <div class="wrap caring">
      <div>
        <h2 class="rv">Caring for People<br>Who Care for Pets</h2>
        <p class="lead rv" style="--d:.06s">We believe that successful hospitals start with the people providing the care. That’s why we invest in benefits worthy of their expertise, so they can focus on what matters most: their patients.</p>
        <h4 class="rv">Robust compensation packages include:</h4>
        <ul class="checks rv">${BENEFITS.map(b=>`<li><svg><use href="#check"/></svg><span>${b}</span></li>`).join('')}</ul>
      </div>
      <div class="ph rv" style="--d:.1s"><span class="ph-label">${cam}${d.caringPh}</span></div>
    </div>
  </section>
  <section class="sec navy cta">
    <div class="wrap">
      <h2 class="rv">Ready to Take the Next Step?</h2>
      <p class="rv" style="--d:.06s">${d.cta}</p>
      <a class="btn btn-gold rv" style="--d:.12s" href="#contact">Explore Opportunities</a>
    </div>
  </section>
</section>`).join('');

/* ---------- Reveal + count-up ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.12});
$$('.rv').forEach(el=>io.observe(el));
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return; cio.unobserve(e.target);
  const el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||'';
  if(reduce){el.textContent=end+suf;return}
  const t0=performance.now(),dur=1400;
  const tick=t=>{const p=Math.min(1,(t-t0)/dur),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v+suf;if(p<1)requestAnimationFrame(tick)};
  el.textContent='0'+suf;requestAnimationFrame(tick);
}),{threshold:.6});
$$('[data-count]').forEach(el=>cio.observe(el));

/* ---------- Router ---------- */
const TITLES={home:'Mission Specialty',about:'About | Mission Specialty',contact:'Contact | Mission Specialty'};
PAGES.forEach(d=>TITLES[slug(d.name)]=d.name+' | Mission Specialty');
function route(){
  const h=location.hash.slice(1)||'home';
  const view=TITLES[h]?h:'home';
  $$('[data-view]').forEach(v=>v.hidden=v.dataset.view!==view);
  document.title=TITLES[view];
  $$('[data-nav]').forEach(a=>a.dataset.nav===h?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  const hero=$(`[data-view="${view}"] .hero-anim`);
  if(hero){hero.classList.remove('play');void hero.offsetWidth;hero.classList.add('play')}
  $('#hdr').classList.remove('open');$('.burger').setAttribute('aria-expanded','false');
  $$('[data-expertise]').forEach(c=>c._update&&c._update());
  if(h==='careers'){requestAnimationFrame(()=>$('#pathways').scrollIntoView({behavior:reduce?'auto':'smooth'}))}
  else window.scrollTo({top:0,behavior:'auto'});
}
addEventListener('hashchange',route);
route();

/* ---------- Header ---------- */
const hdr=$('#hdr');
addEventListener('scroll',()=>hdr.classList.toggle('scrolled',scrollY>8),{passive:true});
$('.burger').onclick=()=>{const o=hdr.classList.toggle('open');$('.burger').setAttribute('aria-expanded',o)};

/* ---------- Video modal ---------- */
const dlg=$('#vdlg');
document.addEventListener('click',e=>{const b=e.target.closest('[data-video]');if(!b)return;$('#vtitle').textContent=b.dataset.video;dlg.showModal()});
$('#vclose').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});

/* ---------- Contact form ---------- */
const form=$('#cform');
const rules={fn:v=>v.trim()?'':'Enter your first name.',ln:v=>v.trim()?'':'Enter your last name.',
  em:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())?'':'Enter an email address like name@clinic.com.',
  sp:v=>v?'':'Choose your specialty.',in:v=>v?'':'Choose what you’re interested in.'};
function check(id){const el=$('#'+id),msg=rules[id](el.value),f=el.closest('.field');$('#'+id+'-e').textContent=msg;f.classList.toggle('invalid',!!msg);el.setAttribute('aria-invalid',!!msg);if(msg)el.setAttribute('aria-describedby',id+'-e');return !msg}
Object.keys(rules).forEach(id=>$('#'+id).addEventListener('blur',()=>{if($('#'+id).value||$('#'+id).closest('.invalid'))check(id)}));
form.addEventListener('submit',e=>{
  e.preventDefault();
  let ok=Object.keys(rules).map(check).every(Boolean);
  const tc=$('#tc').checked;$('#tc-e').textContent=tc?'':'Accept the terms to send your message.';ok=ok&&tc;
  if(!ok){const bad=$('.field.invalid .input',form)||(!tc&&$('#tc'));bad&&bad.focus();return}
  const name=$('#fn').value.trim();
  $('#formwrap').innerHTML=`<div class="success"><div class="ok"><svg><use href="#check"/></svg></div><h2>Message sent</h2><p>Thanks, ${name.replace(/[<>&]/g,'')}. Someone from our recruiting team will reach out within two business days.</p><a class="btn btn-primary" href="#home">Back to home</a></div>`;
});

/* ---------- Newsletter ---------- */
$('#nform').addEventListener('submit',e=>{
  e.preventDefault();const v=$('#nem').value.trim(),m=$('#nmsg');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){m.style.color='#ff9e8f';m.textContent='Enter an email address like name@clinic.com.';return}
  m.style.color='';m.textContent='You’re subscribed. Watch your inbox for updates.';$('#nem').value='';
});
