import * as devKeys from './dev';
import * as prodKeys from './prod';

var keys: any;

export default (): any => {
    if(process.env.NODE_ENV === 'production') {
        keys = prodKeys;
    } else {
        keys = devKeys;
    }

    return keys;
}

