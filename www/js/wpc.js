function wpcnext(e) {
  var evt = e || window.event;
  var div = evt.target.parentNode.parentNode.childNodes;

  for(var i=1;i<div.length;i++) {
    if(div[i].style.display=='block') {
      nxt = i+1;
      if(nxt==div.length) nxt=1;
      div[i].style.display='none';
      div[nxt].style.display='block';
      break;
    }
  }
  return false;
}

function wpcprev(e) {
  var evt = e || window.event;
  var div = evt.target.parentNode.parentNode.childNodes;

  for(var i=1;i<div.length;i++) {
    if(div[i].style.display=='block') {
      prv = i-1;
      if(prv==0) prv=div.length-1;
      div[i].style.display='none';
      div[prv].style.display='block';
      break;
    }
  }
  return false;
}

