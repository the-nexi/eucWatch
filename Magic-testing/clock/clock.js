//main
tcNext.replaceWith(()=>{
	buzzer.nav(buzzer.buzz.ok);
	if (UI.ntid) {clearTimeout(UI.ntid);UI.ntid=0;}
	if ( euc.state!="OFF")
		face.go(ew.is.dash[ew.def.dash.face],0);	
	else {
		face.go("dashGarage",0);
	}
});
tcBack.replaceWith(()=>{
	buzzer.nav(buzzer.buzz.na);
	//face.go("notify",0);
});
face[0] = {
	offms: (ew.def.off[face.appCurr])?ew.def.off[face.appCurr]:10000,
	old:ew.def.bpp?0:1,
	g:w.gfx,
	init: function(){
		this.g.clear(1);
		this.startTime=getTime();
		this.v=w.batt(1);
		this.gui=process.env.BOARD=="BANGLEJS2"?
		{
			top:[0,5,179,20],
			note:[0,20,179,35],
			hour:[0,35,80,130],
			sec:[200,35,179,130],
			min:[99,35,200,130],
			btm:[0,130,179,145],
			date:[10,40,110,45],
			
			batN:[150,55,239,60],
			bat:[162,20,235,60],
			txt:18*UI.size.txt,
			txtS:12*UI.size.txt,
			txtM:25*UI.size.txt,
			txtL:45*UI.size.txt

		}
		:{
			top:[0,20,239,53],
			note:[0,54,239,84],
			sec:[200,85,239,175],
			hour:[0,85,99,175],
			min:[99,85,200,175],
			btm:[0,176,239,200],
			date:[0,55,158,60],

			batN:[150,55,239,60],
			bat:[162,20,235,60],
			txt:25*UI.size.txt,
			txtS:18*UI.size.txt,
			txtM:32*UI.size.txt,
			txtL:72*UI.size.txt
		};
		//top
		this.g.setColor(1,10);
		this.g.fillRect(this.gui.top[0],this.gui.top[1],this.gui.top[2],this.gui.top[3]); 
		this.g.setColor(1,6);
		this.g.fillRect({x:this.gui.note[0],y:this.gui.note[1],x2:this.gui.note[2],y2:this.gui.note[3],r:0}); 
		this.g.fillRect({x:this.gui.btm[0],y:this.gui.btm[1],x2:this.gui.btm[2],y2:this.gui.btm[3],r:0}); 
		//this.g.fillRect(this.gui.btm[0],this.gui.btm[1],this.gui.btm[2],this.gui.btm[3]); 
		this.g.setColor(0,0);
		if (this.old)this.g.flip();
		this.hour=-1;
		this.min=-1;
		this.sec=-1;
		this.run=true;
		this.batt=-1;
		 this.bt=-1;
		this.time();
		this.bat();
		this.date();
		this.bar();
		UI.btn.ntfy(1,3,0,"_bar",6,"eucWatch",". . . . . . . . .",11,0,0);this.g.flip();

	},
	show : function(){
		if (!this.run) return;
		if (this.batt!=ew.is.ondc ){
			this.bat();
		}
		this.time();
		
	this.tid=setTimeout(function(t){
			t.tid=-1;
			t.show();
		},150,this);
	},
	bar:function(){
		UI.ele.ind(1,2,10,8);
		UI.ele.fill("_bar",6,0);
		UIc.start(1,1);
		UIc.end();
	},
	date:function(){
	 if (ew.is.bt != this.bt){
			this.bt=ew.is.bt;
			this.ring=0;
			var colbt=6;
			if (this.bt==3)  colbt=5;
			else if (this.bt==4)  colbt=4;
			else if (this.bt==2)  colbt=9;
			this.g.setColor(0,colbt);
			this.g.fillRect(this.gui.date[0],this.gui.date[1],this.gui.date[2],this.gui.date[3]); 
			this.g.setColor(1,11);
			this.g.setFont("Vector",this.gui.txtM);
			this.g.drawString(this.d[2]+" "+this.d[0].toUpperCase(), ((this.gui.date[2]-this.gui.date[0])/2-(this.g.stringWidth(this.d[2]+" "+this.d[0].toUpperCase()))/2) ,this.gui.top[1]); //date
			if (this.old)this.g.flip();
		}
	},
	bat:function(){
			this.batt=ew.is.ondc;
			this.v=w.batt(1);
			if (this.batt==1) this.g.setColor(0,9);
			else if (this.v<=20) this.g.setColor(0,7);
			else this.g.setColor(0,4);
			//this.g.fillRect(162,20,235,60);//batt
			this.g.fillRect(this.gui.batN[0],this.gui.batN[1],this.gui.batN[2],this.gui.batN[3]); 
			this.g.setColor(1,11);
			if (this.v<=0) {this.g.setFont("Vector",this.gui.txt);this.g.drawString("EMPTY",233-(this.g.stringWidth("EMPTY")),21); 
			}else if (this.v<100) {
				this.g.setFont("Vector",this.gui.txtM);
				this.g.drawString(this.v,200-(this.g.stringWidth(this.v)),21);
				this.g.drawImage((this.batt==1)?require("heatshrink").decompress(atob("jEYwIKHiACEnACHvACEv/AgH/AQcB/+AAQsAh4UBAQUOAQ8EAQgAEA==")):require("heatshrink").decompress(atob("jEYwIEBngCDg//4EGgFgggCZgv/ASUEAQQaBHYPgJYQ=")),205,21);
				//this.g.drawImage(this.image("batteryMed"),212,12);
			}else  {
				this.g.setFont("Vector",this.gui.txt);
				this.g.drawString("FULL",233-(this.g.stringWidth("FULL")),21); 
			} 
	},	
	time:function(){
		//minutes
		this.d=(Date()).toString().split(' ');
		this.t=(this.d[4]).toString().split(':');
		this.s=(this.t[2]).toString().split('');
		if (this.t[1]!=this.min ){
			this.min=this.t[1];
			this.g.setFont("Vector",this.gui.txtL);
			this.fmin=11;
			this.fsec=0;
			if (global.alrm) {
				if (alrm.buzz!=-1) {this.bmin=1;this.fmin=13;this.fsec=13;this.bsec=1;}
				else if (alrm[1].tmr!==-1||alrm[2].tmr!==-1||alrm[3].tmr!==-1) {this.bmin=5;this.fsec=15;this.bsec=5;}
				else  {this.bmin=1;this.fsec=15;this.bsec=1;}
			}else {this.bmin=1;this.fsec=15;this.bsec=1;}
			this.g.setColor(0,this.bmin);
			this.g.fillRect(this.gui.min[0],this.gui.min[1],this.gui.min[2],this.gui.min[3]); 
			this.g.setColor(1,this.fmin);
			this.g.drawString(this.t[1],110,98);
			if (this.old)this.g.flip();
		}
		//seconds
		this.g.setColor(0,this.bsec);
		this.g.fillRect(this.gui.sec[0],this.gui.sec[1],this.gui.sec[2],this.gui.sec[3]); 
		this.g.setColor(1,this.fsec);//
		this.g.setFont("Vector",this.gui.txtS);
		let sec=(ew.def.hr24)?"24H":(this.t[0]<12)?"AM":"PM";
		this.g.drawString(sec,236-(this.g.stringWidth(sec)),102); //hours mode
		this.g.setFont("Vector",this.gui.txt);
		this.g.drawString(this.s[0]+this.s[1],201,129); //seconds
		this.g.flip();
		if (this.old)this.g.flip();
		//hours
		if (this.t[0]!=this.hour){
			this.hour=this.t[0];
			this.g.setColor(0,this.bmin);
			this.g.fillRect(this.gui.hour[0],this.gui.hour[1],this.gui.hour[2],this.gui.hour[3]); 
			this.g.setColor(1,15);
			this.g.setFont("Vector",this.gui.txtL);
			if (ew.def.hr24) {
				this.g.drawString(this.hour,5,97); //hours
			} else {	
				this.hour=(this.hour<10)?(this.hour=="00")?12:this.hour[1]:(this.hour<13)?this.hour:this.hour-12;
				this.g.drawString(this.hour,(this.hour<10)?45:5,97); //hours
			}
			this.g.fillRect(95,115,99,119);
			this.g.fillRect(95,135,99,139);
			if (this.old)this.g.flip();
		}
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

//touch

