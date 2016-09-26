


export const CHANGETREE = "CHANGE_TREE";
export const SHOWTREE = "SHOW_TREE";
export const SHOWLIST = "SHOW_LIST";
export const SAVENOTE = "SAVE_NOTE";

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