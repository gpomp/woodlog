


export const CHANGETREE = "CHANGE_TREE";
export const SHOWTREE = "SHOW_TREE";

export const change = treeData => ({
  type: CHANGETREE,
  payload: new Promise(resolve => {

    const tree = {
      key: 'tree',
      rawData: treeData,
      expires: null
    }

    global.storage.getIdsForKey('tree').then(ids => {
      tree.id = ids.length;
      global.storage.save(tree);
      resolve(tree);
      //NavActions.Tree({ id });
    });
  })
});



/*export const show = id => ({
  type: SHOWTREE,
  payload: new Promise(resolve => {

    global.storage.load({
      key: 'tree',
      id: id
    }).then(res => {
      console.log(res);
      resolve(res);
    });
  })
});*/