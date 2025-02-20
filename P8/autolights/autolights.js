// Autolights app - automatically controls EUC lights based on speed
face[0] = {
  offms: 5000,
  g:w.gfx,
  init: function(){
    this.g.clear();
    this.g.setColor(1,11);
    this.g.fillRect(0,0,239,100);
    this.g.setColor(0,0);
    this.g.setFont("Vector",35);
    this.g.drawString("AUTO LIGHTS",120-(this.g.stringWidth("AUTO LIGHTS")/2),20);
    this.g.setFont("Vector",25);
    this.g.drawString("Speed: --",120-(this.g.stringWidth("Speed: --")/2),60);
    this.g.flip();
    this.g.setColor(1,15);
    this.g.setFont("Vector",20);
    this.g.drawString("Status",120-(this.g.stringWidth("Status")/2),120);
    this.g.drawString("LIGHTS: OFF",120-(this.g.stringWidth("LIGHTS: OFF")/2),150);
    this.g.flip();
    this.run=true;
    this.lightsOn=false;
    this.tid=-1;
  },
  show : function(){
    if (!this.run) return;
    if (!euc.state || euc.state !== "READY") {
      this.g.setColor(0,1);
      this.g.fillRect(0,140,239,170);
      this.g.setColor(1,15);
      this.g.setFont("Vector",20);
      this.g.drawString("NOT CONNECTED",120-(this.g.stringWidth("NOT CONNECTED")/2),150);
      this.g.flip();
    } else {
      let speed = euc.dash.live.spd;
      // Update speed display
      this.g.setColor(0,1);
      this.g.fillRect(0,50,239,90);
      this.g.setColor(1,11);
      this.g.setFont("Vector",25);
      this.g.drawString("Speed: "+speed.toFixed(1),120-(this.g.stringWidth("Speed: "+speed.toFixed(1))/2),60);
      this.g.flip();
      
      // Control lights based on speed
      if (speed >= 10 && !this.lightsOn) {
        euc.wri("lightsOn");
        this.lightsOn = true;
        this.g.setColor(0,1);
        this.g.fillRect(0,140,239,170);
        this.g.setColor(1,15);
        this.g.setFont("Vector",20);
        this.g.drawString("LIGHTS: ON",120-(this.g.stringWidth("LIGHTS: ON")/2),150);
        this.g.flip();
      } else if (speed < 10 && this.lightsOn) {
        euc.wri("lightsOff");
        this.lightsOn = false;
        this.g.setColor(0,1);
        this.g.fillRect(0,140,239,170);
        this.g.setColor(1,15);
        this.g.setFont("Vector",20);
        this.g.drawString("LIGHTS: OFF",120-(this.g.stringWidth("LIGHTS: OFF")/2),150);
        this.g.flip();
      }
    }
    
    this.tid=setTimeout(function(t){
      t.tid=-1;
      t.show();
    },100,this);
  },
  tid:-1,
  run:false,
  clear : function(){
    this.run=false;
    if (this.tid>=0) clearTimeout(this.tid);
    this.tid=-1;
    return true;
  },
  off: function(){
    this.g.off();
    this.clear();
  }
};

face[1] = {
  offms:1000,
  init: function(){
    return true;
  },
  show : function(){
    face.go(face.appRoot[0],face.appRoot[1]);
    return true;
  },
  clear: function(){
    return true;
  },
  off: function(){
    this.clear();
  }
};

touchHandler[0]=function(e,x,y){
  switch (e) {
  case 1: // slide down
    face.go("clock",0);
    return;
  case 2: // slide up
    if (y>200&&x<50) {
      if (w.gfx.bri.lv!==7) {this.bri=w.gfx.bri.lv;w.gfx.bri.set(7);}
      else w.gfx.bri.set(this.bri);
      buzzer.nav([30,50,30]);
    } else buzzer.nav(40);
    break;
  case 3: // slide left
    buzzer.nav(40);
    break;
  case 4: // slide right (back)
    face.go(face.appPrev,face.pagePrev);
    return;
  case 12: // long press
    buzzer.nav(40);
    break;
  default:
    this.timeout();
  }
}; 