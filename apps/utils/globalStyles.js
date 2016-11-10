

import { Dimensions } from 'react-native';
export const { width, height } = Dimensions.get('window');



export const LOGO_IMAGE = require('../../assets/logo.png');
export const BLANK_IMAGE = require('../../assets/blank.jpg');

export const REG_PADDING = 20;
export const TEXT_PADDING = 30;
export const BG_COLOR = '#f2f2f2';
export const TRADE_GOTHIC = 'TradeGothicLTStd-Cn18';

export const container = {
	padding: REG_PADDING,
  width, height,
  overflow: 'hidden',
  backgroundColor:BG_COLOR,
  position: 'relative'
};

export const contentContainer = {
  height, 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center'
}

export const textReg = {
	fontFamily: 'Seattle Sans',
	color: '#383735',
	fontSize: 33,
	letterSpacing: 1.3,
	opacity: 0.6
};

export const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

var LABEL_COLOR = '#242424';
var INPUT_COLOR = '#242424';
var ERROR_COLOR = '#AC0000';
var HELP_COLOR = '#242424';
export const BORDER_COLOR = '#797979';
var DISABLED_COLOR = '#FF0000';
var DISABLED_BACKGROUND_COLOR = '#FF0000';
var FONT_SIZE = 20;
var BIG_FONT_SIZE = 25;
var FONT = 'Seattle Sans';

export const formatDate = (date) => {
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const m = date.getMonth() + 1;
  const month = m < 10 ? (`0${m}`) : m;
  return `${month}  ${day}  ${date.getFullYear()}`;
}

export const formStyleSheet = {
  fieldset: {
  	flexDirection: 'column'
  },
  // the style applied to the container of all inputs
  formGroup: {
    normal: {
    	flexDirection: 'row',
    	flex: 0,
    	alignItems: 'center',
    	borderBottomColor: BORDER_COLOR,
    	borderBottomWidth: 1,
      paddingLeft: TEXT_PADDING,
      paddingRight: TEXT_PADDING,
      paddingTop:0,
      paddingBottom:0,
      marginBottom: 3
    },
    error: {
      flexDirection: 'row',
      flex: 0,
      alignItems: 'center',
      borderBottomColor: BORDER_COLOR,
      borderBottomWidth: 1,
      paddingLeft: TEXT_PADDING,
      paddingRight: TEXT_PADDING,
      paddingTop:0,
      paddingBottom:0,
      marginBottom: 3
    }
  },
  controlLabel: {
    normal: {
      color: LABEL_COLOR,
      fontSize: FONT_SIZE,
      fontFamily: FONT,
      padding: 7,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      letterSpacing: 1.3
    },
    // the style applied when a validation error occours
    error: {
      color: ERROR_COLOR,
      fontSize: FONT_SIZE,
      fontFamily: FONT,
      padding: 7,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      letterSpacing: 1.3
    }
  },
  helpBlock: {
    normal: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE
    },
    // the style applied when a validation error occours
    error: {
      color: HELP_COLOR,
      fontSize: FONT_SIZE
    }
  },
  errorBlock: {
    fontSize: FONT_SIZE,
    color: ERROR_COLOR
  },
  textbox: {
    normal: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
    	flex: 1,
      height: 36,
      padding: 7,
      fontFamily: FONT,
      letterSpacing: 1.3
    },
    // the style applied when a validation error occours
    error: {
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
    	flex: 1,
      height: 36,
      padding: 7,
      fontFamily: FONT,
      letterSpacing: 1.3,
      color: ERROR_COLOR
    },
    // the style applied when the textbox is not editable
    notEditable: {
      fontSize: FONT_SIZE,
      height: 36,
      padding: 7,
      borderRadius: 4,
      borderColor: BORDER_COLOR,
      borderWidth: 0,
      color: DISABLED_COLOR,
      backgroundColor: DISABLED_BACKGROUND_COLOR
    }
  },
  checkbox: {
    normal: {
    },
    // the style applied when a validation error occours
    error: {
    }
  },
  select: {
    normal: {
    },
    // the style applied when a validation error occours
    error: {
    }
  },
  pickerTouchable: {
    normal: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center'
    },
    error: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center'
    }
  },
  pickerValue: {
    normal: {
      fontSize: FONT_SIZE,
      paddingLeft: 7
    },
    error: {
      fontSize: FONT_SIZE,
      paddingLeft: 7
    }
  },
  datepicker: {
    normal: {
    },
    // the style applied when a validation error occours
    error: {
    }
  },
  dateTouchable: {
    normal: {

    },
    error: {}
  },
  dateValue: {
    normal: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      color: INPUT_COLOR,
      fontSize: FONT_SIZE,
      fontFamily: FONT
    },
    error: {
      color: ERROR_COLOR,
      fontSize: FONT_SIZE,
      padding: 7
    }
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
};

export const bigFormStyleSheet = {
	textbox: {
		normal: {
    	fontSize: BIG_FONT_SIZE,
      height: 45
  	},
    error: {
      fontSize: BIG_FONT_SIZE,
      color: ERROR_COLOR,
      height: 45
    }
	},
	formGroup: {		
  	normal: {
  		borderBottomWidth: 3
  	}, error: {
      borderBottomWidth: 3,
      borderBottomColor: ERROR_COLOR
    }
	}
};

export const autoFieldSS = {
	formGroup: {
    normal: {
    	justifyContent: 'space-between',
    	borderBottomWidth: 0,
    	flex: 0,
    	paddingRight: 0
    }
  },
  textbox: {
		normal: {
    	borderBottomColor: BORDER_COLOR,
    	borderBottomWidth: 1
  	}
	}
};

export const mediumFieldSS = {
	formGroup: {
    normal: {
    	justifyContent: 'space-between',
    	borderBottomWidth: 0,
      flex: 0,
    	paddingRight: 0,
    	flexWrap: 'wrap'
    }
  },
  textbox: {
		normal: {
    	width: (width - REG_PADDING * 2 - TEXT_PADDING) * 0.5,
      flex: -1,
    	borderBottomColor: BORDER_COLOR,
    	borderBottomWidth: 1
  	}
	},
	controlLabel: {
    normal: {
      flex: -1,
    	width: (width - REG_PADDING * 2 - TEXT_PADDING) * 0.5
    }
  }
};

export const dateFieldSS = {
	formGroup: {
    normal: {
    	flexDirection: 'row',
    	borderBottomWidth: 0,
    	alignItems: 'flex-start',
      flex: 0,
    	paddingRight: 0,
    	width: (width - REG_PADDING * 2 - TEXT_PADDING),
    	flexWrap: 'wrap'
    }
  },
	controlLabel: {
    normal: {
    	position: 'absolute',
    	top: 0,
    	left: TEXT_PADDING,
    	width: (width - REG_PADDING * 2 - TEXT_PADDING) * 0.5
    }
  },
  dateTouchable: {
    normal: {
    	padding: 7,
    	borderBottomColor: BORDER_COLOR,
    	borderBottomWidth: 1,
    	width: (width - REG_PADDING * 2 - TEXT_PADDING) * 0.5
    }
  },
  dateValue: {
    normal: {
      letterSpacing: 1.3,
    	textAlign: 'center'
    }
  },
  datepicker: {
    normal: {
    	flex: 0,
    	marginTop: 30,
    	width: (width - REG_PADDING * 2 - TEXT_PADDING)
    	
    }
  }
}

export const nestedStructSS = {
	fieldset: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		paddingLeft: TEXT_PADDING
	},

	controlLabel: {
		normal: {
			flex: -1,
			width: (width - REG_PADDING * 2 - TEXT_PADDING) * 0.5,
    	height: 36
		}
	},

	formGroup: {
		normal: {
			flex: -1,
			alignItems: 'flex-start',
			borderBottomWidth: 0,
			flexDirection: 'row',
			flexWrap: 'wrap',
			paddingLeft: 0,
			paddingRight: 0
		}
	},

	textbox: {
		normal: {
			width: 33,
			flex: -1,
			paddingLeft: 5,
			paddingRight: 5,
    	borderBottomColor: BORDER_COLOR,
    	borderBottomWidth: 1,
    	textAlign: 'center'
		}
	},
	helpBlock: {
    normal: {
    	flex: -1,
    	height: 36,
    	paddingLeft: 8,
    	paddingRight: 8,
    	paddingTop: 7,
    	paddingBottom: 7
    }
  }
}
