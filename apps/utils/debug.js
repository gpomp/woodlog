
export const removeAllImages = () => {
	//empty photos;
	global.storage.getIdsForKey('tree').then(ids => {
	    for (var i = 0; i < ids.length; i++) {
	    	emptyPhoto(ids[i]);
	    }

	    global.storage.clearMapForKey('img');
	});		
}

const emptyPhoto = (i) => {
	global.storage.load({
		key: 'tree',
		id: i
	}).then((resp) => {
		const respCopy = Object.assign({}, resp);
		respCopy.photos = [];
		global.storage.save({
			key: 'tree',
			id: i,
			rawData: respCopy
		})
	})
}