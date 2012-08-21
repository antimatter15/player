ID3v2 = {
	parseStream: function(stream, onComplete){

	var PICTURE_TYPES = {
		"0": "Other",
		"1": "32x32 pixels 'file icon' (PNG only)",
		"2": "Other file icon",
		"3": "Cover (front)",
		"4": "Cover (back)",
		"5": "Leaflet page",
		"6": "Media (e.g. lable side of CD)",
		"7": "Lead artist/lead performer/soloist",
		"8": "Artist/performer",
		"9": "Conductor",
		"A": "Band/Orchestra",
		"B": "Composer",
		"C": "Lyricist/text writer",
		"D": "Recording Location",
		"E": "During recording",
		"F": "During performance",
		"10": "Movie/video screen capture",
		"11": "A bright coloured fish", //<--- WTF?
		"12": "Illustration",
		"13": "Band/artist logotype",
		"14": "Publisher/Studio logotype",
	}

	//from: http://bitbucket.org/moumar/ruby-mp3info/src/tip/lib/mp3info/id3v2.rb
	//TODO: replace with something longer
	var TAGS = {
		"AENC": "Audio encryption",
		"APIC": "Attached picture",
		"COMM": "Comments",
		"COMR": "Commercial frame",
		"ENCR": "Encryption method registration",
		"EQUA": "Equalization",
		"ETCO": "Event timing codes",
		"GEOB": "General encapsulated object",
		"GRID": "Group identification registration",
		"IPLS": "Involved people list",
		"LINK": "Linked information",
		"MCDI": "Music CD identifier",
		"MLLT": "MPEG location lookup table",
		"OWNE": "Ownership frame",
		"PRIV": "Private frame",
		"PCNT": "Play counter",
		"POPM": "Popularimeter",
		"POSS": "Position synchronisation frame",
		"RBUF": "Recommended buffer size",
		"RVAD": "Relative volume adjustment",
		"RVRB": "Reverb",
		"SYLT": "Synchronized lyric/text",
		"SYTC": "Synchronized tempo codes",
		"TALB": "Album",
		"TBPM": "BPM",
		"TCOM": "Composer",
		"TCON": "Genre",
		"TCOP": "Copyright message",
		"TDAT": "Date",
		"TDLY": "Playlist delay",
		"TENC": "Encoded by",
		"TEXT": "Lyricist",
		"TFLT": "File type",
		"TIME": "Time",
		"TIT1": "Content group description",
		"TIT2": "Title",
		"TIT3": "Subtitle",
		"TKEY": "Initial key",
		"TLAN": "Language(s)",
		"TLEN": "Length",
		"TMED": "Media type",
		"TOAL": "Original album",
		"TOFN": "Original filename",
		"TOLY": "Original lyricist",
		"TOPE": "Original artist",
		"TORY": "Original release year",
		"TOWN": "File owner",
		"TPE1": "Artist",
		"TPE2": "Band",
		"TPE3": "Conductor",
		"TPE4": "Interpreted, remixed, or otherwise modified by",
		"TPOS": "Part of a set",
		"TPUB": "Publisher",
		"TRCK": "Track number",
		"TRDA": "Recording dates",
		"TRSN": "Internet radio station name",
		"TRSO": "Internet radio station owner",
		"TSIZ": "Size",
		"TSRC": "ISRC (international standard recording code)",
		"TSSE": "Software/Hardware and settings used for encoding",
		"TYER": "Year",
		"TXXX": "User defined text information frame",
		"UFID": "Unique file identifier",
		"USER": "Terms of use",
		"USLT": "Unsychronized lyric/text transcription",
		"WCOM": "Commercial information",
		"WCOP": "Copyright/Legal information",
		"WOAF": "Official audio file webpage",
		"WOAR": "Official artist/performer webpage",
		"WOAS": "Official audio source webpage",
		"WORS": "Official internet radio station homepage",
		"WPAY": "Payment",
		"WPUB": "Publishers official webpage",
		"WXXX": "User defined URL link frame"
	};

	var TAG_MAPPING_2_2_to_2_3 = {
		"BUF": "RBUF",
		"COM": "COMM",
		"CRA": "AENC",
		"EQU": "EQUA",
		"ETC": "ETCO",
		"GEO": "GEOB",
		"MCI": "MCDI",
		"MLL": "MLLT",
		"PIC": "APIC",
		"POP": "POPM",
		"REV": "RVRB",
		"RVA": "RVAD",
		"SLT": "SYLT",
		"STC": "SYTC",
		"TAL": "TALB",
		"TBP": "TBPM",
		"TCM": "TCOM",
		"TCO": "TCON",
		"TCR": "TCOP",
		"TDA": "TDAT",
		"TDY": "TDLY",
		"TEN": "TENC",
		"TFT": "TFLT",
		"TIM": "TIME",
		"TKE": "TKEY",
		"TLA": "TLAN",
		"TLE": "TLEN",
		"TMT": "TMED",
		"TOA": "TOPE",
		"TOF": "TOFN",
		"TOL": "TOLY",
		"TOR": "TORY",
		"TOT": "TOAL",
		"TP1": "TPE1",
		"TP2": "TPE2",
		"TP3": "TPE3",
		"TP4": "TPE4",
		"TPA": "TPOS",
		"TPB": "TPUB",
		"TRC": "TSRC",
		"TRD": "TRDA",
		"TRK": "TRCK",
		"TSI": "TSIZ",
		"TSS": "TSSE",
		"TT1": "TIT1",
		"TT2": "TIT2",
		"TT3": "TIT3",
		"TXT": "TEXT",
		"TXX": "TXXX",
		"TYE": "TYER",
		"UFI": "UFID",
		"ULT": "USLT",
		"WAF": "WOAF",
		"WAR": "WOAR",
		"WAS": "WOAS",
		"WCM": "WCOM",
		"WCP": "WCOP",
		"WPB": "WPB",
		"WXX": "WXXX"
	};

	//pulled from http://www.id3.org/id3v2-00 and changed with a simple replace
	//probably should be an array instead, but thats harder to convert -_-
	var ID3_2_GENRES = {
		"0": "Blues",
		"1": "Classic Rock",
		"2": "Country",
		"3": "Dance",
		"4": "Disco",
		"5": "Funk",
		"6": "Grunge",
		"7": "Hip-Hop",
		"8": "Jazz",
		"9": "Metal",
		"10": "New Age",
		"11": "Oldies",
		"12": "Other",
		"13": "Pop",
		"14": "R&B",
		"15": "Rap",
		"16": "Reggae",
		"17": "Rock",
		"18": "Techno",
		"19": "Industrial",
		"20": "Alternative",
		"21": "Ska",
		"22": "Death Metal",
		"23": "Pranks",
		"24": "Soundtrack",
		"25": "Euro-Techno",
		"26": "Ambient",
		"27": "Trip-Hop",
		"28": "Vocal",
		"29": "Jazz+Funk",
		"30": "Fusion",
		"31": "Trance",
		"32": "Classical",
		"33": "Instrumental",
		"34": "Acid",
		"35": "House",
		"36": "Game",
		"37": "Sound Clip",
		"38": "Gospel",
		"39": "Noise",
		"40": "AlternRock",
		"41": "Bass",
		"42": "Soul",
		"43": "Punk",
		"44": "Space",
		"45": "Meditative",
		"46": "Instrumental Pop",
		"47": "Instrumental Rock",
		"48": "Ethnic",
		"49": "Gothic",
		"50": "Darkwave",
		"51": "Techno-Industrial",
		"52": "Electronic",
		"53": "Pop-Folk",
		"54": "Eurodance",
		"55": "Dream",
		"56": "Southern Rock",
		"57": "Comedy",
		"58": "Cult",
		"59": "Gangsta",
		"60": "Top 40",
		"61": "Christian Rap",
		"62": "Pop/Funk",
		"63": "Jungle",
		"64": "Native American",
		"65": "Cabaret",
		"66": "New Wave",
		"67": "Psychadelic",
		"68": "Rave",
		"69": "Showtunes",
		"70": "Trailer",
		"71": "Lo-Fi",
		"72": "Tribal",
		"73": "Acid Punk",
		"74": "Acid Jazz",
		"75": "Polka",
		"76": "Retro",
		"77": "Musical",
		"78": "Rock & Roll",
		"79": "Hard Rock",
		"80": "Folk",
		"81": "Folk-Rock",
		"82": "National Folk",
		"83": "Swing",
		"84": "Fast Fusion",
		"85": "Bebob",
		"86": "Latin",
		"87": "Revival",
		"88": "Celtic",
		"89": "Bluegrass",
		"90": "Avantgarde",
		"91": "Gothic Rock",
		"92": "Progressive Rock",
		"93": "Psychedelic Rock",
		"94": "Symphonic Rock",
		"95": "Slow Rock",
		"96": "Big Band",
		"97": "Chorus",
		"98": "Easy Listening",
		"99": "Acoustic",
		"100": "Humour",
		"101": "Speech",
		"102": "Chanson",
		"103": "Opera",
		"104": "Chamber Music",
		"105": "Sonata",
		"106": "Symphony",
		"107": "Booty Bass",
		"108": "Primus",
		"109": "Porn Groove",
		"110": "Satire",
		"111": "Slow Jam",
		"112": "Club",
		"113": "Tango",
		"114": "Samba",
		"115": "Folklore",
		"116": "Ballad",
		"117": "Power Ballad",
		"118": "Rhythmic Soul",
		"119": "Freestyle",
		"120": "Duet",
		"121": "Punk Rock",
		"122": "Drum Solo",
		"123": "A capella",
		"124": "Euro-House",
		"125": "Dance Hall"
		};
		
	var tag = {
		pictures: []
	};
	
	
	var max_size = Infinity;
	
	function read(bytes, callback){
		stream(bytes, callback, max_size);
	}
	
	
	function encode_64(input) {
		var output = "", i = 0, l = input.length,
		key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", 
		chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		while (i < l) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) enc3 = enc4 = 64;
			else if (isNaN(chr3)) enc4 = 64;
			output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
		}
		return output;
	}



	function parseDuration(ms){
		var msec = parseInt(cleanText(ms)) //leading nulls screw up parseInt
		var secs = Math.floor(msec/1000);
		var mins = Math.floor(secs/60);
		var hours = Math.floor(mins/60);
		var days = Math.floor(hours/24);
	
		return {
			milliseconds: msec%1000,
			seconds: secs%60,
			minutes: mins%60,
			hours: hours%24,
			days: days
		};
	}


	function pad(num){
		var arr = num.toString(2);
		return (new Array(8-arr.length+1)).join('0') + arr;
	}

	function arr2int(data){
		if(data.length == 4){
			if(tag.revision > 3){
				var size = data[0] << 0x15;
				size += data[1] << 14;
				size += data[2] << 7;
				size += data[3];
			}else{
				var size = data[0] << 24;
				size += data[1] << 16;
				size += data[2] << 8;
				size += data[3];
			}
		}else{
			var size = data[0] << 16;
			size += data[1] << 8;
			size += data[2];
		}
		return size;
	}
	
	function parseImage(str){
		var TextEncoding = str.charCodeAt(0);
		str = str.substr(1);
		var MimeTypePos = str.indexOf('\0');
		var MimeType = str.substr(0, MimeTypePos);
		str = str.substr(MimeTypePos+1);
		var PictureType = str.charCodeAt(0);
		var TextPictureType = PICTURE_TYPES[PictureType.toString(16).toUpperCase()];
		str = str.substr(1);
		var DescriptionPos = str.indexOf('\0');
		var Description = str.substr(0, DescriptionPos);
		str = str.substr(DescriptionPos+1);
		var PictureData = str;
		var Magic = PictureData.split('').map(function(e){return String.fromCharCode(e.charCodeAt(0) & 0xff)}).join('');
		return {
			dataURL: 'data:'+MimeType+';base64,'+encode_64(Magic),
			PictureType: TextPictureType,
			Description: Description,
			MimeType: MimeType
		};
	}
	
	function parseImage2(str){
		var TextEncoding = str.charCodeAt(0);
		str = str.substr(1);
		var Type = str.substr(0, 3);
		str = str.substr(3);
		
		var PictureType = str.charCodeAt(0);
		var TextPictureType = PICTURE_TYPES[PictureType.toString(16).toUpperCase()];
		
		str = str.substr(1);
		var DescriptionPos = str.indexOf('\0');
		var Description = str.substr(0, DescriptionPos);
		str = str.substr(DescriptionPos+1);
		var PictureData = str;
		var Magic = PictureData.split('').map(function(e){return String.fromCharCode(e.charCodeAt(0) & 0xff)}).join('');
		return {
			dataURL: 'data:img/'+Type+';base64,'+encode_64(Magic),
			PictureType: TextPictureType,
			Description: Description,
			MimeType: MimeType
		};
	}

	var TAG_HANDLERS = {
		"APIC": function(size, s, a){
			tag.pictures.push(parseImage(s));
		},
		"PIC": function(size, s, a){
			tag.pictures.push(parseImage2(s));
		},
		"TLEN": function(size, s, a){
			tag.Length = parseDuration(s);
		},
		"TCON": function(size, s, a){
			s = cleanText(s);
			if(/\([0-9]+\)/.test(s)){
				var genre = ID3_2_GENRES[parseInt(s.replace(/[\(\)]/g,''))]
			}else{
				var genre = s;
			}
			tag.Genre = genre;
		}
	};

	function read_frame(){
		if(tag.revision < 3){
			read(3, function(frame_id){
				//console.log(frame_id)
				if(/[A-Z0-9]{3}/.test(frame_id)){
					var new_frame_id = TAG_MAPPING_2_2_to_2_3[frame_id.substr(0,3)];
					read_frame2(frame_id, new_frame_id);
				}else{
					onComplete(tag);
					return;
				}
			})
		}else{
			read(4, function(frame_id){
				//console.log(frame_id)
				if(/[A-Z0-9]{4}/.test(frame_id)){
					read_frame3(frame_id);
				}else{
					onComplete(tag);
					return;
				}
			})
		}
	}
	
	
	function cleanText(str){
		if(str.indexOf('http://') != 0){
			var TextEncoding = str.charCodeAt(0);
			str = str.substr(1);
		}
		//screw it i have no clue
		return str.replace(/[^A-Za-z0-9\(\)\{\}\[\]\!\@\#\$\%\^\&\* \/\"\'\;\>\<\?\,\~\`\.\n\t]/g,'');
	}
	
	
	function read_frame3(frame_id){
		read(4, function(s, size){
			var intsize = arr2int(size);
			read(2, function(s, flags){
				flags = pad(flags[0]).concat(pad(flags[1]));
				read(intsize, function(s, a){
					if(typeof TAG_HANDLERS[frame_id] == 'function'){
						TAG_HANDLERS[frame_id](intsize, s, a);
					}else if(TAGS[frame_id]){
						tag[TAGS[frame_id]] = (tag[TAGS[frame_id]]||'') + cleanText(s)
					}else{
						tag[frame_id] = cleanText(s)
					}
					read_frame();
				})
			})
		})
	}
	
	function read_frame2(v2ID, frame_id){
		read(3, function(s, size){
			var intsize = arr2int(size);
			read(intsize, function(s, a){
				if(typeof TAG_HANDLERS[v2ID] == 'function'){
					TAG_HANDLERS[v2ID](intsize, s, a);
				}else if(typeof TAG_HANDLERS[frame_id] == 'function'){
					TAG_HANDLERS[frame_id](intsize, s, a);
				}else if(TAGS[frame_id]){
					tag[TAGS[frame_id]] = (tag[TAGS[frame_id]]||'') + cleanText(s)
				}else{
						tag[frame_id] = cleanText(s)
					}
									//console.log(tag)
				read_frame();
			})
		})
	}
	
	
	read(3, function(header){
		if(header == "ID3"){
			read(2, function(s, version){
				tag.version = "ID3v2."+version[0]+'.'+version[1];
				tag.revision = version[0];
				//console.log('version',tag.version);
				read(1, function(s, flags){
					//todo: parse flags
					flags = pad(flags[0]);
					read(4, function(s, size){
						max_size = arr2int(size);
						read(0, function(){}); //signal max
						read_frame()
					})
				})
			})
		}else{
			onComplete(tag);
			return false; //no header found
		}
	})
	return tag;
},

parseURL: function(url, onComplete){
	var xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.overrideMimeType('text/plain; charset=x-user-defined');

	var pos = 0, 
			bits_required = 0, 
			handle = function(){},
			maxdata = Infinity;

	function read(bytes, callback, newmax){
		bits_required = bytes;
		handle = callback;
		maxdata = newmax;
		if(bytes == 0) callback('',[]);
	}
	var responseText = '';
	(function(){
		if(xhr.responseText){
			responseText = xhr.responseText;
		}
		if(xhr.responseText.length > maxdata) xhr.abort();

		if(responseText.length > pos + bits_required && bits_required){
			var data = responseText.substr(pos, bits_required);
			var arrdata = data.split('').map(function(e){return e.charCodeAt(0) & 0xff});
			pos += bits_required;
			bits_required = 0;
			if(handle(data, arrdata) === false){
				xhr.abort();
				return;
			}
		}
		setTimeout(arguments.callee, 0);
	})()
	xhr.send(null);
	return [xhr, ID3v2.parseStream(read, onComplete)];
},
parseFile: function(file, onComplete){

	var reader = new FileReader();

	var pos = 0, 
			bits_required = 0, 
			handle = function(){},
			maxdata = Infinity;

	function read(bytes, callback, newmax){
		bits_required = bytes;
		handle = callback;
		maxdata = newmax;
		if(bytes == 0) callback('',[]);
	}
	var responseText = '';
	reader.onload = function(){
		responseText = reader.result;
	};

	(function(){
	
		if(responseText.length > pos + bits_required && bits_required){
			var data = responseText.substr(pos, bits_required);
			var arrdata = data.split('').map(function(e){return e.charCodeAt(0) & 0xff});
			pos += bits_required;
			bits_required = 0;
			if(handle(data, arrdata) === false){
				return;
			}
		}
		setTimeout(arguments.callee, 0);
	})()
	reader.readAsBinaryString(fileSlice(file, 0, 128 * 1024));
	return [reader, ID3v2.parseStream(read, onComplete)];
}
}


function fileSlice(file, start, length){
  if(file.mozSlice) return file.mozSlice(start, start + length);
  if(file.webkitSlice) return file.webkitSlice(start, start + length);
  if(file.slice) return file.slice(start, length);
}


//doesnt quite belong here but doesnt quite belong elsewhere either
function guessSong(n){
	var parts = unescape(n)
		.replace(/^.*(music|desktop|document|video|home)/gi,'')
		.replace(/\[[^\]]+\]/g,'')
		.replace(/_/g,' ')
		.replace(/[0-9]+\s*(kbps|\-)/,'')
		.split(/[\/]/)
		.reverse();

	var name = parts[0]
		.replace(/\.(mp3|ogg|flac)/,'')
		.replace(/^\s|\s$/g,'')
		.replace(/^\d+\s*/,'');

	var artist='Unknown',album='Unknown';

	if(/\-/.test(name)){
		var np = name.split('-').reverse();
		name = np[0];
		if(np.length >= 2){
			artist = np[1];
		}
		if(np.length >= 3){
			artist = np[2];
			album = np[1]
		}
		if(parts[1] && parts[2]){
			var album = parts[2]
				.replace(/^\s|\s$/g,'');
			if(!album){
				album = parts[1]
				.replace(/^\s|\s$/g,'');
			}
		}
	}else{
		if(parts[1]){
			var album = parts[1]
			.replace(/^\s|\s$/g,'')
		}
		if(parts[2]){
			var artist = parts[2]
				.replace(/^\s|\s$/g,'')
				.replace(/^\d+\s*/,'');
		}
	}
	if(/\-/.test(album)){
		var as = album.split('-');
		album = as[1];
		if(!artist){
			artist = as[0];
		}
	}
	return {
		Title: name,
		Artist: artist,
		Album: album
	}
}