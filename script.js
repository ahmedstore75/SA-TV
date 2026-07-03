// ১. সিকিউরিটি এবং প্রোটেকশন (Inspect Element ও কপি বন্ধ করা)
!function(){
    "use strict";
    if(window.location.protocol==="view-source:"){ window.location.href="https://rslivetv.vercel.app/" }
    console.clear();
    console.log=function(){}; console.warn=function(){}; console.error=function(){}; console.info=function(){};
    
    function debuggerCheck(){
        var start=performance.now();
        debugger;
        var end=performance.now();
        if(end-start>100){ window.location.href="about:blank" }
    }
    setInterval(debuggerCheck,1e3);
    
    document.addEventListener('keydown',function(e){
        var key=e.keyCode||e.which;
        if(key===123||(e.ctrlKey&&e.shiftKey&&(key===73||key===74))||(e.ctrlKey&&key===85)||(e.ctrlKey&&key===83)||(e.ctrlKey&&key===80)||(e.ctrlKey&&key===67)||(e.ctrlKey&&key===86)||(e.ctrlKey&&key===88)||key===44){
            e.preventDefault(); e.stopPropagation(); return false;
        }
    });
    
    document.addEventListener('contextmenu',function(e){e.preventDefault();return false});
    document.addEventListener('copy',function(e){e.preventDefault();return false});
    document.addEventListener('cut',function(e){e.preventDefault();return false});
    document.addEventListener('paste',function(e){e.preventDefault();return false});
    document.addEventListener('dragstart',function(e){e.preventDefault();return false});
    document.addEventListener('selectstart',function(e){e.preventDefault();return false});
    
    document.addEventListener('touchstart',function(e){if(e.touches.length>1){e.preventDefault();return false}},{passive:false});
    document.addEventListener('touchmove',function(e){if(e.touches.length>1){e.preventDefault();return false}},{passive:false});
    
    document.querySelectorAll('img, iframe, video').forEach(function(el){
        el.setAttribute('draggable','false');
        el.addEventListener('dragstart',function(e){e.preventDefault();return false});
        el.addEventListener('contextmenu',function(e){e.preventDefault();return false});
    });
}();

// ২. গিটহাব লাইভ স্পোর্টস ডাটা লোড ও সার্চ লজিক
const PLAYLIST_URL='https://raw.githubusercontent.com/sm-monirulislam/Upcoming-and-Live-Sports-Data/refs/heads/main/Sports_data.json';
const container=document.getElementById('channel-container');
const searchInput=document.getElementById('channelSearch');

function renderChannels(channels){
    container.innerHTML='';
    if(!channels||channels.length===0){
        container.innerHTML='<p style="color:#aaa;text-align:center;padding:20px;">⚠️ কোনো ম্যাচ বা চ্যানেল পাওয়া যায়নি।</p>';
        return;
    }
    channels.forEach((channel,index)=>{
        // গিটহাব ডেটার টাইটেল, লিঙ্ক ও থাম্বনেইল ম্যাপ করা হলো
        const name=channel.Title || `ম্যাচ ${index+1}`;
        const url=channel.StreamLink || channel.EmbedLink || '#';
        const image=channel.Thumbnail || 'https://i.postimg.cc/mD1VCt2C/RS-Live.png';
        
        const li=document.createElement('li');
        li.setAttribute('tabindex','0');
        li.innerHTML=`<div style="display:block;text-decoration:none;pointer-events:none;width:100%;"><img src="${image}" alt="${name}" loading="lazy" onerror="this.src='https://i.postimg.cc/mD1VCt2C/RS-Live.png';"><div class="channel-info-box"><p class="channel-title">${name}</p></div></div>`;
        
        li.addEventListener('click',function(){
            if(window.frames['player']){
                window.frames['player'].location.href=url;
            }
            if(searchInput){
                searchInput.value='';
                const items=container.querySelectorAll('li');
                items.forEach(item=>item.style.display='');
                searchInput.blur();
            }
        });
        container.appendChild(li);
    });
    setupSearchFilter();
}

function setupSearchFilter(){
    const searchField=document.getElementById('channelSearch');
    if(!searchField)return;
    if(searchField._listenerAdded)return;
    searchField._listenerAdded=true;
    searchField.addEventListener('input',function(){
        const filter=this.value.toLowerCase().trim();
        const items=container.querySelectorAll('li');
        items.forEach(item=>{
            const title=item.querySelector('.channel-title');
            if(title){
                const text=title.textContent.toLowerCase();
                item.style.display=text.includes(filter)?'':'none';
            }
        });
    });
}

function loadChannels(){
    fetch(PLAYLIST_URL+'?t='+Date.now()).then(res=>{
        if(!res.ok)throw new Error(`HTTP ${res.status}`);
        return res.json();
    }).then(data=>{
        if(!Array.isArray(data))throw new Error('JSON অ্যারে নয়');
        renderChannels(data);
    }).catch(()=>{
        container.innerHTML=`<p style="color:#ff6b6b;text-align:center;padding:20px;">⚠️ ডেটা লোড করতে সমস্যা হচ্ছে<br><span style="font-size:12px;color:#888;">দয়া করে একটু পরে আবার চেষ্টা করুন</span></p>`;
    });
}

// ইন্ট্রো লোডার রিমুভ
window.addEventListener('DOMContentLoaded',function(){
    setTimeout(()=>{
        const loader=document.getElementById('intro-loader');
        if(loader){
            loader.style.opacity='0';
            loader.style.visibility='hidden';
            setTimeout(()=>loader.remove(),500);
        }
    },1200);
});

loadChannels();

// ৩. অ্যান্ড্রয়েড টিভি বা কীবোর্ড নেভিগেশন কন্ট্রোল
document.addEventListener('keydown',function(event){
    const items=Array.from(document.querySelectorAll('#channel-container li')).filter(el=>el.style.display!=='none');
    const active=document.activeElement;
    const searchInput=document.getElementById('channelSearch');
    
    if(active===searchInput){
        if(event.keyCode===13||event.key==="Enter"){
            event.preventDefault(); event.stopPropagation();
            if(items.length>0){ items[0].click() }
            searchInput.blur(); return false;
        }
        if(event.keyCode===40||event.key==="ArrowDown"){
            event.preventDefault();
            if(items.length>0)items[0].focus();
        }
        return;
    }
    
    if(items.length===0)return;
    let index=items.indexOf(active);
    
    if(event.keyCode===40||event.key==="ArrowDown"){
        event.preventDefault();
        let nextIndex=index+1;
        if(nextIndex<items.length)items[nextIndex].focus();
    }else if(event.keyCode===38||event.key==="ArrowUp"){
        event.preventDefault();
        let prevIndex=index-1;
        if(prevIndex>=0){
            items[prevIndex].focus();
        }else if(prevIndex===-1&&searchInput){
            searchInput.focus();
        }
    }else if(event.keyCode===13||event.key==="Enter"){
        if(active&&active.tagName==='LI'){
            event.preventDefault(); active.click();
        }
    }
});

function initTVFocus(){
    setTimeout(()=>{
        const firstChannel=document.querySelector('#channel-container li');
        const searchInput=document.getElementById('channelSearch');
        if(firstChannel&&document.activeElement!==searchInput){ firstChannel.focus() }
    },600);
}
initTVFocus();
