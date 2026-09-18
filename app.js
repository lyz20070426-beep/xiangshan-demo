'use strict';
const $ = s => document.querySelector(s);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const regions = ['north','north','north','north','north','europe','asia','north','europe','europe','oceania','oceania'];
let region = 'all', expanded = false, lastBrief = '', photoURL = null;
function renderGardens() {
  const items = GARDENS.map((g,i)=>({...g,index:i})).filter(g=>region==='all'||regions[g.index]===region);
  const visible = expanded ? items : items.slice(0,6);
  $('#gardens').innerHTML = visible.map(g=>`<button class="garden-card" data-index="${g.index}" aria-label="查看${escapeHTML(g.name)}详情"><span class="garden-top"><span>${escapeHTML(g.place.split(' · ').slice(0,2).join(' / '))}</span><b>${String(g.index+1).padStart(2,'0')}</b></span><h3>${escapeHTML(g.name)}</h3><span class="garden-en">${escapeHTML(g.en)}</span><span class="garden-bottom"><span>${escapeHTML(g.shortyear)} · ${escapeHTML(g.type)}</span><b>↗</b></span></button>`).join('');
  $('#result-count').textContent = `显示 ${visible.length} / ${items.length} 个作品`;
  $('#more').hidden = items.length <= 6;
  $('#more').textContent = expanded ? '收起作品 ↑' : `展开全部${items.length}个作品 ↓`;
}
document.querySelectorAll('[data-region]').forEach(button=>button.addEventListener('click',()=>{
  region=button.dataset.region; expanded=false;
  document.querySelectorAll('[data-region]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  renderGardens();
}));
$('#more').addEventListener('click',()=>{expanded=!expanded;renderGardens();if(!expanded)$('#world').scrollIntoView();});
$('#gardens').addEventListener('click',e=>{
  const button=e.target.closest('[data-index]'); if(!button)return;
  const g=GARDENS[Number(button.dataset.index)];
  $('#detail-content').innerHTML=`<p class="eyebrow">GARDENS AROUND THE WORLD / ${String(Number(button.dataset.index)+1).padStart(2,'0')}</p><h2>${escapeHTML(g.name)}</h2><p class="detail-meta">${escapeHTML(g.en)}<br>${escapeHTML(g.place)}<br>${escapeHTML(g.year)}</p><p>${escapeHTML(g.intro)}</p><h3>看什么</h3><p>${escapeHTML(g.features)}</p><h3>谁参与了营造</h3><p>${escapeHTML(g.background)}</p><h3>官方资料与实景</h3>${g.sources.map(([label,url])=>`<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} ↗</a>`).join('')}<p class="detail-disclaimer">海外作品资料汇总，不代表本公司参与项目或与园方存在合作关系。点击来源可查看园方介绍与实景。</p>`;
  $('#detail').showModal();
});
const crafts=[['木作 · 结构里也有韵律','柱、梁、格扇与檐下的尺度，塑造建筑的骨架与气质。设计时既要看得见木材之美，也要考虑结构、耐候与后续维护。'],['砖瓦 · 白墙黛瓦的分寸','屋面的线条、墙面的留白与铺地的纹理，共同构成安静的底色。材料选择需要与当地气候、防水排水和施工条件相适应。'],['山石 · 让自然有层次','山石不仅是装饰，也参与组织视线与游路。形态、尺度和位置，需要与水面、植物和人的活动空间一起考虑。'],['造境 · 步移景异的智慧','借景、框景、对景，让有限空间有更丰富的层次。一扇窗、一面墙、一段曲折的路，都可以成为看风景的方式。']];
function setCraft(index){$('#craft-content').innerHTML=`<h3>${crafts[index][0]}</h3><p>${crafts[index][1]}</p>`;}
document.querySelectorAll('[data-craft]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-craft]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});setCraft(Number(button.dataset.craft));}));
document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('[name="scene"]').value=button.dataset.scene;$('#brief').scrollIntoView();}));
$('.menu').addEventListener('click',()=>{const open=$('#nav').classList.toggle('open');$('.menu').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>{$('#nav').classList.remove('open');$('.menu').setAttribute('aria-expanded','false');}));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
$('#photo').addEventListener('change',()=>{
  const preview=$('#photo-preview');preview.hidden=true;preview.removeAttribute('src');$('#photo-status').textContent='';
  if(photoURL){URL.revokeObjectURL(photoURL);photoURL=null;}
  const file=$('#photo').files[0]; if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){$('#photo-status').textContent='请选择10MB以内的JPG、PNG或WebP图片。';$('#photo').value='';return;}
  photoURL=URL.createObjectURL(file);preview.onload=()=>{preview.hidden=false;$('#photo-status').textContent='照片已在本地预览，不会上传，也不附在文本需求单中。';};preview.onerror=()=>{$('#photo-status').textContent='无法读取这张图片，请重新选择。';$('#photo').value='';preview.hidden=true;};preview.src=photoURL;
});
const prompts={'私人庭院':'建议准备一张场地平面草图，并标出入口、现有树木、朝向和希望保留的区域。先讨论休憩、动线与维护，再决定是否增加水景或亭廊。','茶室与亭廊':'建议补充预计使用人数、是否全年使用、是否需要封闭或采暖。先明确停留方式，再讨论尺寸、材料和与主建筑的关系。','酒店与公共空间':'建议补充人流、运营方式与开放时间。先明确空间的用途与维护责任，再讨论园林布局和分期建设。'};
$('#brief-form').addEventListener('submit',e=>{
  e.preventDefault();const form=new FormData(e.currentTarget);const city=String(form.get('city')).trim();
  if(!city){const input=document.querySelector('[name="city"]');input.setCustomValidity('请填写项目所在城市');input.reportValidity();return;}
  const scene=String(form.get('scene'));const entries=[['项目城市',city],['空间类型',scene],['场地面积',form.get('size')],['风格倾向',form.get('style')],['生活愿望',String(form.get('wish')).trim()||'待进一步交流'],['场地照片',$('#photo').files.length?'已在本地选择，需另行提供':'暂未提供']];
  $('#brief-result').innerHTML=entries.map(([k,v])=>`<div class="brief-item"><span>${escapeHTML(k)}</span><span>${escapeHTML(v)}</span></div>`).join('')+`<div class="guidance"><strong>下一步可以准备</strong>${escapeHTML(prompts[scene])}</div><p class="note">规则式需求整理演示，未接入AI模型；未分析上传照片。</p>`;
  lastBrief='香山 · 庭院初步需求单\n\n'+entries.map(([k,v])=>`${k}：${v}`).join('\n')+'\n\n交流准备：'+prompts[scene]+'\n\n本需求单由网站演示在本地生成，未发送；不构成设计方案、报价或服务承诺。场地照片不包含在此文本中。';
  $('#brief-dialog').showModal();
});
document.querySelector('[name="city"]').addEventListener('input',e=>e.target.setCustomValidity(''));
$('#download-brief').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\ufeff'+lastBrief],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='我的庭院需求单.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
renderGardens();setCraft(0);
