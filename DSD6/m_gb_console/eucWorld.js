E.setConsole(Serial1,{force:true});

//atc
var eucR= function(evt){
  //var ll=0; require("Storage").write("evt"+ll,evt); ll++;
  //global.srt=String.fromCharCode.apply(String,evt.data);  
  print("evt.data");
  //repl=[0xAA,0x55,0x0f,0x20,euc.dash.spd*100,0x00,0x04,0x00,0x3B,0xB4,0x08,0x00,0xa4,0x06,0x02,0xe0,0xa9,0x14,0x5A,0x5A]; //rf 4C
	eucwW([0xAA,0x55,0x0f,0x20,0X00,0x00,0x04,0x00,0x3B,0xB4,0x08,0x00,0xa4,0x06,0x02,0xe0,0xa9,0x14,0x5A,0x5A]);
  
};
//
NRF.setServices({
  0xfff0: {
     0xfff1: {
      value : "1",
      maxLen : 20,
      writable : true,
	  notify:true,
      onWrite : function(evt) {
		set.eucR(evt);
       //set.eucwW( [170, 85, 75, 83, 45, 83, 49, 56, 45, 48, 50, 48, 54, 0, 0, 0, 187, 20, 131, 253]);
        //set.eucwW([0xAA,0x55,0x0f,0x20,euc.dash.spd*100,0x00,0x04,0x00,0x3B,0xB4,0x08,0x00,0xa4,0x06,0x02,0xe0,0xa9,0x14,0x5A,0x5A]);
      }
     }
   },
  0xffe0: {
     0xffe1: {
      value : "1",
      maxLen : 20,
      writable : true,
	  notify:true,
      onWrite : function(evt) {
		set.eucR(evt);
       //set.eucwW( [170, 85, 75, 83, 45, 83, 49, 56, 45, 48, 50, 48, 54, 0, 0, 0, 187, 20, 131, 253]);
        //set.eucwW([0xAA,0x55,0x0f,0x20,euc.dash.spd*100,0x00,0x04,0x00,0x3B,0xB4,0x08,0x00,0xa4,0x06,0x02,0xe0,0xa9,0x14,0x5A,0x5A]);
      }
     }
   }

}, { advertise: ['0xfff0'], uart:(set.def.cli||set.def.gb)?true:false,hid:(set.def.hid&&set.def.hidM)?set.def.hidM.report:undefined });

var eucwW= function(o) {
    NRF.updateServices({
     0xffe0 : {
     0xffe1 : {
       value : o,
       notify:true
     }
     }
   });
// }
};

