
E.setConsole(Serial1,{force:true}); //0000 devmode
euc={};
euc.dash=[];
euc.dash.bat=10;
timeLast=getTime();
//lolo= new Uint8Array([0x5a,0xa5,0x20,0x14,0x3e,0x04,0xb0,0x00,0x00,0x00,0x00,0x48,0x98,0x00,0x00,euc.dash.bat,0x00,0x00,0x00,0x00,0x00,0x18,0x38,0x25,0x00,0x00,0x00,0x3b,0x00,0xbe,0x00,0xa2,0x14,0x08,0x00,0x00,0x00,0x00,0x00]);

/*
NRF.setServices({
	0xfee7: {
		0xfec8: {
			value : [0x02],
			maxLen : 20,
			description:"Characteristic 2"
		},
		0xfec7: {
			value : [0x02],
			maxLen : 20,
			description:"Characteristic 2"
		},
		0xfec9: {
			value : [0x02],
			maxLen : 20,
			description:"Characteristic 2"
		}
	}
}, { });
*/		
function checksum(packet){
	var end = packet[2] + 7;
	var sum = 0;
	for(var i = 2; i < end; i++)
		sum += packet[i];
	return (sum & 0xFFFF) ^ 0xFFFF;
}

function Checksum(buffer) {
	var check = 0;
	for (c in buffer) {
		check = check + (c & 0xff);
	}
	check ^= 0xFFFF;
	check &= 0xFFFF;
	return check;
}

function send(data){
	var packetLen = 2 + data.byteLength;
	var packet = new Uint8Array(packetLen);
	packet.set(data, 0);
	var check = checksum(data);
	packet[packetLen - 2] = check & 0xFF;
	packet[packetLen - 1] = (check >> 8) & 0xFF;
	//return packet;
	return Bluetooth.write(packet);
	//lolo= new Uint8Array([0x5a,0xa5,0x02,0x14,0x3e,0x04,0x1a,0x07,0x11])   firmware
	//lolo=new Uint8Array([0x5a,0xa5,0x06,0x14,0x3e,0x04,0x66,0x17,0x01,0x17,0x01,0x01,0x01]);
	//lolo=new Uint8Array([0x5a,0xa5,0x02,0x14,0x3e,0x04,0x68,0x01,0x01]);  start
	//lolo=new Uint8Array([0x5a,0xa5,0x0e,0x14,0x3e,0x04,0x10,0x4e,0x33,0x4f,0x54,0x43,0x31,0x38,0x33,0x33,0x54,0x30,0x30,0x33,0x38]);  model info
}	

function sendT(data){
	var packetLen = 2 + data.byteLength;
	var packet = new Uint8Array(packetLen);
	packet.set(data, 0);
	var check = checksum(data);
	packet[packetLen - 2] = check & 0xFF;
	packet[packetLen - 1] = (check >> 8) & 0xFF;
	return packet;
	//return Bluetooth.write(packet)
}

function bcon() {
   console.log("in",Bluetooth.read());
    Bluetooth.on('data',ccon);
}
function bdis() {
    Bluetooth.removeListener('data',ccon);
	//if (emuMon) { clearInterval(emuMon);emuMon=0;}
}
function ccon(l){ 
	var lolo;
	if (l=="U\xAA\3\x11\1\x1A\2\xCE\xFF"){
		print(1,l.charCodeAt(0));
		return;
	}
	else if  (l=="Z\xA5\1>\x14\1\xB0\x20\xDB\xFE"){//live
		if (1 < getTime() - timeLast  ){
			lolo= new Uint8Array([0x5a,0xa5,0x20,0x14,0x3e,0x04,0xb0,0x00,0x00,0x00,0x00,0x48,0x98,0x00,0x00,0x41,0x00,0x00,0x00,0x00,0x00,0x18,0x38,0x25,0x00,0x00,0x00,0x3b,0x00,0xbe,0x00,0xa2,0x14,0x08,0x00,0x00,0x00,0x00,0x00]);
				timeLast=getTime();
			print("live");
		}else {
			print("delay");
			return;
		}
	}
	else if  (l=="Z\xA5\1>\x14\1\x25\x0c\x7a\xFF"){ //live2
		lolo= new Uint8Array([0x5a,0xa5,0x0c,0x14,0x3e,0x04,0x25,0xf0,0x15,0x08,0xe5,0xd2,0x93,0x7b,0x56,0xa2,0xb8,0x7d,0xf6]);  
		print("unk16-live2");
	}
	else if  (l=="Z\xA5\1>\x14\1\x61\x04\x46\xFF"){ //live3
		lolo= new Uint8Array([0x5a,0xa5,0x04,0x14,0x3e,0x04,0x61,0x00,0x00,0x08,0xe5]);  
		print("unk17-live3");
	}
	else if  (l=="Z\xA5\1>\x14\1\x1A\2\x8F\xFF"){ //firmware
		lolo= new Uint8Array([0x5a,0xa5,0x02,0x14,0x3e,0x04,0x1a,0x07,0x11]);  
		print("firmware");
	}
	else if  (l=="Z\xA5\1>\x14\1\x68\2\x41\xFF"){ //start
		lolo= new Uint8Array([0x5a,0xa5,0x02,0x14,0x3e,0x04,0x68,0x01,0x01]);  
		print("start");
	}
	else if  (l=="Z\xA5\1>\x14\1\x10\x0e\x8d\xFF"){ //info
//		lolo= new Uint8Array([0x5a,0xa5,0x0e,0x14,0x3e,0x04,0x10,0x4e,0x33,0x4f,0x54,0x43,0x31,0x38,0x33,0x33,0x54,0x30,0x30,0x33,0x38]);  
		lolo= new Uint8Array([0x5a,0xa5,0x0e,0x14,0x3e,0x04,0x10,0x4e,0x33,0x4f,0x54,0x43,0x31,0x38,0x33,0x33,0x54,0x30,0x30,0x30,0x30]);  
		print("model info");
	}
	else if  (l=="Z\xA5\1>\x14\1\x66\6\x3f\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x06,0x14,0x3e,0x04,0x66,0x17,0x01,0x17,0x01,0x01,0x01]);  
		print("unk1");
	}
	else if  (l=="Z\xA5\0>\x16\x5b\0\x50\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x10,0x16,0x3e,0x5b,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00]);  
		print("unk2");
	}	
	else if  (l=="Z\xA5\1>\x14\1\x10\x0E\x8D\xF7"){
		lolo= new Uint8Array([0x5a,0xa5,0x0e,0x14,0x3e,0x04,0x10,0x4e,0x33,0x47,0xb1,0x69,0xb3,0x43,0x65,0x13,0x6e,0x64,0xc6,0x33,0x38]);  
		print("unk3");
	}	
	else if  (l=="Z\xA5\1>\x14\1\xD2\x04\xD5\xFE"){
		lolo= new Uint8Array([90, 165, 4, 20, 62, 4, 210, 0, 0, 18, 229]);  
//		Bluetooth.write([90, 165, 4, 20, 62, 4, 210, 0, 0, 18, 229, 220, 253]);
		print("unk4");
	}		
	else if  (l=="Z\xA5\1>\x14\1\xC6\x02\xE3\xFE"){
		lolo= new Uint8Array([0x5a,0xa5,0x02,0x14,0x3e,0x04,0xc6,0x01,0x00]) ; 
		print("unk5-unencr");
	}
	else if  (l=="Z\xA5\1>\x14\1\xF5\x02\xB4\xFE"){
		lolo= new Uint8Array([0x5a,0xa5,0x02,0x14,0x3e,0x04,0xf5,0xe2,0x03]) ; 
		print("unk6-unencr");
	}
	else if  (l=="Z\xA5\1>\x14\1\x7c\x08\x27\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x08,0x14,0x3e,0x04,0x7c,0x04,0x00,0x24,0xe4,0xfa,0x85,0xef,0x47]);
		print("unk6");
	}
	else if  (l=="Z\xA5\1>\x14\1\x72\x06\x33\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x06,0x14,0x3e,0x04,0x72,0x00,0x00,0x28,0xab,0x3a,0xa5])  ;
		print("unk7");
	}	
	else if  (l=="Z\xA5\1>\x14\1\x69\x02\x40\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x02,0x14,0x3e,0x04,0x69,0x5c,0x26]);  
		print("unk8");
	}
	else if  (l=="Z\xA5\1>\x11\1\x10\x1a\x84\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x1a,0x11,0x3e,0x04,0x10,0x34,0x39,0x51,0xa0,0x7b,0xb3,0x43,0x1e,0x11,0x6b,0x64,0xc5,0x30,0x30,0x17,0x01,0x80,0x25,0x88,0xc0,0xc6,0x91,0x3d,0x56,0x87,0x3a]);  
		print("unk9");
	}
	else if  (l=="Z\xA5\1>\x11\1\x3b\x02\x71\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x02,0x11,0x3e,0x04,0x3b,0x62,0x00]);  
		print("unk10");
	}
	else if  (l=="Z\xA5\1>\x11\1\x20\x02\x8c\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x02,0x11,0x3e,0x04,0x20,0x01,0x25]) ; 
		print("unk11");
	}
	else if  (l=="Z\xA5\1>\x12\1\x10\x1a\x83\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x1a,0x12,0x3e,0x04,0x10,0x34,0x39,0x51,0xa0,0x7b,0xb3,0x43,0x1e,0x11,0x6b,0x64,0xc5,0x30,0x30,0x17,0x01,0x80,0x25,0x88,0xc0,0xc6,0x91,0x38,0x56,0x87,0x3a]);  
		print("unk12");
	}
	else if  (l=="Z\xA5\1>\x12\1\x3b\x02\x70\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x02,0x12,0x3e,0x04,0x3b,0x62,0x00]) ; 
		print("unk13");
	}
	else if  (l=="Z\xA5\1>\x12\1\x20\x02\x8b\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x02,0x12,0x3e,0x04,0x20,0x01,0x25]);  
		print("unk14");
	}
	else if  (l=="Z\xA5\1>\x14\1\x3e\x02\x6b\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x02,0x14,0x3e,0x04,0x3e,0x8a,0x01]);  
		print("unk18");
	}
	else if  (l=="Z\xA5\1>\x14\1\x43\x0a\x5e\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x0a,0x14,0x3e,0x04,0x43,0x72,0x01,0x08,0xe5,0x2a,0x82,0x7b,0x56,0x5d,0x2e]);  
		print("unk19");
	}
	else if  (l=="Z\xA5\1>\x14\1\xd2\x04\xd5\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x04,0x14,0x3e,0x04,0xd2,0x00,0x00,0x12,0xe5]);  
		print("unk20");
	}
	else if  (l=="Z\xA5\1>\x11\1\x30\x0e\x70\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x0e,0x11,0x3e,0x04,0x30,0x01,0x00,0xd0,0xf2,0x15,0x82,0x7b,0x56,0xb4,0x2e,0x63,0xc0,0x00,0x20]);  
		print("unk21");
	}
	else if  (l=="Z\xA5\1>\x11\1\x40\x1e\x50\xFF"){ 
		lolo= new Uint8Array([0x5a,0xa5,0x1e,0x11,0x3e,0x04,0x40,0xa2,0x0e,0xae,0xeb,0x8d,0x8c,0xdc,0x58,0x86,0x34,0xe3,0xf8,0xbd]);  
		print("unk22");
	}
	else if  (l=="Z\xA5\1>\x12\1\x30\x0e\x6f\xFF"){ 
		lolo= new Uint8Array([0x5a,0xa5,0x0e,0x12,0x3e,0x04,0x30,0x01,0x00,0x88,0xf2,0x14,0x82,0x7e,0x56,0xac,0x2e,0x62,0xc3,0x00,0x00]);  
		print("unk23");
	}
	else if  (l=="Z\xA5\1>\x12\1\x40\x1e\x4f\xFF"){
		lolo= new Uint8Array([0x5a,0xa5,0x1e,0x12,0x3e,0x04,0x40,0xa7,0x0e,0x93,0xeb,0x8b,0x8c,0xd7,0x58,0x88,0x34,0xe5,0xf8,0xb2,0x0e,0xaf,0x0e,0xb5,0x0e,0xba,0xeb,0x85,0x8c,0xcc,0x58,0x96,0x34,0xec,0xf8,0x00,0x00]);  
		print("unk24");
	}
	else {
		print("Unknown",l);
		return;
    }
	send(lolo);
}
NRF.on('disconnect',bdis);  
NRF.on('connect',bcon);

