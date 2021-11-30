//dash simple

face[0] = {
	offms: (set.def.off[face.appCurr])?set.def.off[face.appCurr]:10000,
	old:set.def.bpp?0:1,
	g:w.gfx,
	spd:[],
	init: function(){
		if ( euc.day[0] < Date().getHours() && Date().getHours() < euc.day[1] ) euc.night=0; else euc.night=1;
        if (this.old&&face.appPrev.startsWith("dash_")) {
			this.g.setColor(0,0);
			this.g.fillRect(0,51,239,239);
			this.g.flip();	
		}else this.g.clear();
		if (dash.live.tpms&&!tpms.euc[dash.live.tpms]){
			this.g.setColor(0,1);
			this.g.clearRect(0,210,239,239); 
			this.g.setColor(1,3);
			this.g.setFontVector(18);
			this.g.drawString("WAITING FOR TPMS",25,220); 
			if (this.old)this.g.flip();
		}else this.tpms=-1;
		this.spdC=[0,13,7,7];
		this.ampC=[1,2992,7,7];
		this.tmpC=[1,2992,7,7];
		this.batC=[4,1,7,7];
		this.spd=-1;
		this.amp=-1;
		this.tmp=-1;
		this.time=-1;
		this.bat=-1;
		this.volt=-1;
		this.conn=0;
		this.lock=2;
		this.spdF=dash.live.spdF*((set.def.dash.mph)?0.625:1);
		this.trpF=dash.live.trpF*((set.def.dash.mph)?0.625:1);
		this.run=true;
	},
	show : function(o){
		if (!this.run) return;
		if (euc.state=="READY") {
			this.g.setColor(0,0);
			//this.g.fillRect(0,0,0,0);
			if (this.old)this.g.flip();
			if (this.spd!=Math.round(dash.live.spd)) this.spdf();
			if (!set.def.dash.clkS){	
				if (this.tmp!=dash.live.tmp.toFixed(1))	this.tmpf();}
			else if (60 < getTime()-this.time )	
				this.clkf();
			if (set.def.dash.batS){	if (this.bat!=dash.live.bat)	this.batf();}
			else  if (this.volt!=dash.live.volt.toFixed(1)) this.vltf();
			else if (dash.live.tpms&&tpms.euc[dash.live.tpms]&&(this.tpms!=tpms.euc[dash.live.tpms].alrm)) this.tpmsf();
		//} else if (euc.state=="OFF")  {
		//	setTimeout(function(){
		//		face.go("dashOff",0);
		//	},150);
		//	return;
		//rest
		} else  {
			if (euc.state!=this.conn) {
				this.conn=euc.state;
				this.g.setColor(0,0);
				this.g.fillRect(0,0,239,239);
				this.g.setColor(1,15);
				this.g.setFont("Vector",50);
				this.g.drawString(euc.state,(125-this.g.stringWidth(euc.state)/2),95);
				if (this.old)this.g.flip();
				this.spd=-1;this.time=0;this.amp=-1;this.tmp=-1;this.volt=-1;this.bat=-1;this.trpL=-1;this.conn=0;this.lock=2;this.run=true;}
		}
		if (!this.old)this.g.flip();
		//refresh 
		this.tid=setTimeout(function(t){
			t.tid=-1;
			t.show();
		},100,this);
	},
	tmpf: function(){
		this.tmp=dash.live.tmp.toFixed(1);
		this.g.setColor(0,this.tmpC[dash.live.tmpC]);
		this.g.fillRect(0,0,119,50);       
		this.g.setColor(1,15);
		this.g.setFontVector(50);
		let temp=((set.def.dash.farn)?this.tmp*1.8+32:this.tmp).toString().split(".");
		let size=5+this.g.stringWidth(temp[0]);
		this.g.drawString(temp[0], 5,3); 
		if (temp[0]<100) {
			this.g.setFontVector(35);
			this.g.drawString("."+temp[1],size,17); 
			size=size+this.g.stringWidth(temp[1]);
		}
		this.g.setFontVector(16);
		this.g.drawString((set.def.dash.farn)?"°F":"°C",3+size,5); 
		if (this.old)this.g.flip();
	},
	clkf: function(){
		this.time=getTime();
		this.g.setColor(0,1);
		this.g.fillRect(0,0,119,50);       
		this.g.setColor(1,14);
		this.g.setFontVector(45);
		let d=(Date()).toString().split(' ');
		let t=(d[4]).toString().split(':');
		this.time=(t[0]+":"+t[1]);
		this.g.drawString(this.time,0,5); 
		//this.g.setFontVector(13);
		//this.g.drawString("CLOCK",1,40);
		if (this.old)this.g.flip();
	},
	batf: function(){
		this.bat=dash.live.bat;
		this.g.setColor(0,this.batC[dash.live.batC]);
		this.g.fillRect(122,0,239,50);
//		this.g.setColor(1,15);
		this.g.setColor(1,15);
		this.g.setFontVector(50);
		this.g.drawString(this.bat,225-(this.g.stringWidth(this.bat)),3);
		this.g.setFontVector(20);
		this.g.drawString("%",227,8);
		if (this.old)this.g.flip();
	},
	vltf: function(){
		this.volt=dash.live.volt.toFixed(1);
		this.g.setColor(0,this.batC[dash.live.batC]);
		this.g.fillRect(122,0,239,50);
		this.g.setColor(1,15);
		let volt=this.volt.toString().split(".");
		this.g.setFontVector(14);
		this.g.drawString("V",230,30); 
		let size=230;
		if (volt[0]<100) {
			this.g.setFontVector(35);
			size=size-this.g.stringWidth("."+volt[1]);
			this.g.drawString("."+volt[1],size,15); 
		}
		this.g.setFontVector(50);
		this.g.drawString(volt[0], size-this.g.stringWidth(volt[0]),3); 
		if (this.old)this.g.flip();
	},
	spdf: function(){
		this.spd=Math.round(dash.live.spd);
		this.g.setColor(0,(dash.live.spdC==1)?0:this.spdC[dash.live.spdC]);
		this.g.fillRect(0,55,239,210);
		this.g.setColor(1,(dash.live.spdC==1)?13:15);
		if (100 <= this.spd) {
			if (120 < this.spd)  this.spd=120;
			this.g.setFontVector(130);
		}else 
			this.g.setFontVector(185);	  
		this.g.drawString(Math.round(this.spd*this.spdF),132-(this.g.stringWidth(Math.round(this.spd*this.spdF))/2),55); 
		if (this.old)this.g.flip();
	},
	ampf: function(){
		this.amp=dash.live.amp;
		this.g.setColor(0,this.ampC[dash.live.ampC]);
		this.g.fillRect(80,0,160,55); //amp 
		this.g.setColor(1,15);
		this.g.setFontVector(33);
		this.g.drawString(this.amp|0,(122-(this.g.stringWidth(this.amp|0)/2)),5); 
		if (this.old)this.g.flip();
	},
	tpmsf: function(){
		this.tpms=tpms.euc[dash.live.tpms].alrm;
		this.g.setColor(0,(this.tpms)?7:4);
		this.g.clearRect(0,210,239,239); //amp 
		this.g.setColor(1,14);
		this.g.setFontVector(25);
		this.g.drawString("TPMS",85,215); 
		if (this.old)this.g.flip();
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
//loop face
face[1] = {
	offms:1000,
	init: function(){
		return true;
	},
	show : function(){
		if (euc.state=="OFF") face.go("main",0); else {face.pageCurr=0;face.go(set.dash[set.def.dash.face],-1);}
	return true;
	},
	clear: function(){
		return true;
	},
	off: function(){
		return true;
	},
};	

//touch-main
touchHandler[0]=function(e,x,y){
	switch (e) {
	case 5: //tap event
		if (x < 120 && y < 60){//temp/clock
			if (set.def.dash.clkS==undefined) set.def.dash.clkS=0;
			set.def.dash.clkS=1-set.def.dash.clkS;
			face[0].time=-1;face[0].tmp=-1;
			buzzer(buz.ok);
		}else if (120 < x && y < 60){//batery percentage/voltage
			if (set.def.dash.batS==undefined) set.def.dash.batS=0;
			set.def.dash.batS=1-set.def.dash.batS;
			face[0].bat=-1;face[0].volt=-1;
			buzzer(buz.ok);
		}
		else{	
			buzzer(buz.na);
		}
		break;
    case 1: //slide down event
		if (set.def.dash.face+1>=set.dash.length) set.def.dash.face=0; else set.def.dash.face++;
		face.go(set.dash[set.def.dash.face],0);
		return;
    case 2: //slide up event
		if (y>160&&x<50) {
			if (w.gfx.bri.lv!==7) {this.bri=w.gfx.bri.lv;w.gfx.bri.set(7);}
			else w.gfx.bri.set(this.bri);
			buzzer(buz.ok);
		}else if (Boolean(require("Storage").read("settings"))) {face.go("settings",0);return;}
		break;
    case 3: //slide left event
		(euc.state=="READY")?face.go('dash'+require("Storage").readJSON("dash.json",1)['slot'+require("Storage").readJSON("dash.json",1).slot+'Maker'],0):(euc.state=="OFF")?face.go("dashGarage",0):buzzer(buz.na);
		return;
    case 4: //slide right event (back action)
		face.go("main",0);
		return;
    case 12: //touch and hold(long press) event
		buzzer(buz.na);
		break;
    }
};