import RNFS from 'react-native-fs';


export const CHANGETREE = "CHANGE_TREE";
export const SHOWTREE = "SHOW_TREE";
export const SHOWLIST = "SHOW_LIST";
export const SAVENOTE = "SAVE_NOTE";
export const REMOVENOTE = "REMOVE_NOTE";
export const RESET = "RESET_TREE";

export const SAVENEWPHOTO = "SAVE_NEW_PHOTO";
export const DELETEPHOTO = "DELETE_PHOTO";

export const change = (treeData, id) => ({
  type: CHANGETREE,
  payload: new Promise(resolve => {

    const tree = {
      key: 'tree',
      rawData: treeData,
      expires: null
    }

    global.storage.getIdsForKey('tree').then(ids => {
      tree.id = id === -1 ? ids.length : id;

      global.storage.save(tree);
      resolve(tree);
    });
  })
});



export const getList = () => ({
  type: SHOWLIST,
  payload: new Promise(resolve => {

    global.storage.getAllDataForKey('tree').then(ret => {
      resolve({data: ret});
    });
  })
});

export const reset = () => {
  return { type: RESET };
}


export const show = id => ({
  type: SHOWTREE,
  payload: new Promise(resolve => {

    global.storage.load({
      key: 'tree',
      id: id
    }).then(res => {
      resolve({rawData: res, id: id});
    });
  })
});

export const saveNote = (note, id) => {

  return {
    type: SAVENOTE,
    payload: {note, id}
  }
};

export const removeNote = (id) => {

  return {
    type: REMOVENOTE,
    payload: {id}
  }
};

export const savePhoto = (src) => ({
  type: SAVENEWPHOTO,
  payload: new Promise(resolve => {

    global.storage.getIdsForKey('img').then(ids => {

      const img = {
        key: 'img',
        id: ids.length,
        rawData: { src: src },
        expires: null
      }

      global.storage.save(img);
      resolve({id: img.id});
    });
  })
});

export const removePhoto = (id) => ({
  type: DELETEPHOTO,
  payload: new Promise(resolve => {
    // Get the img url
    global.storage.load({
      key: 'img',
      id: id
    }).then(res => {
      // Remove image from storage
      global.storage.remove({
        key: 'img', id: id
      }).then(res => {
        if(res === null) {
          resolve({id: id});
          return;
        }
        RNFS.unlink(res.src)
        .then(() => {
          resolve({id: id});
        }).catch(err => {
          resolve({id: id});
        });
      });     
    }).catch(err => {
      resolve({id: id});
    });
  })
});