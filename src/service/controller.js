const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 2666;
const service = require('./service.js');
const idService = require('./mockIDService.js');

app.use(bodyParser.json({ extended: true, type: '*/*' }) );
app.use(express.static(__dirname + '/../public') );

app.post('/users',(req, res) => { 
    const info = idService.getID();
    service.newUser(info.userId);
    res.send( JSON.stringify( info ));
});

app.get('/users',(req, res) => {
    const active = idService.activeUsers;
    const withCustomList = active.filter(userId => service.hasCustomList(userId));
    res.send( JSON.stringify( { activeUsers : active, withCustomList : withCustomList} ));
});

app.get('/:userId/fav', (req, res) => { 
    const currentId=req.get('currentId');
    if ( currentId !== req.params.userId){
        res.status(403).send('you have no such permission on this list');
    }
    else{
        res.send( JSON.stringify( cardListWithFavMark( service.getFavCardIdsOf(currentId), currentId ) ));
    }
});

app.post('/:userId/fav', (req, res) => {
    const currentId=req.get('currentId');
    if ( currentId !== req.params.userId){
        res.status(403).send('you have no such permission on this list');
    }
    else{ 
        service.addToFavOf(req.body.id, currentId);
        //res.send('OK');
        res.send( JSON.stringify( cardListWithFavMark( service.getFavCardIdsOf(currentId), currentId ) ));
    }
});

app.delete('/:userId/fav/:cardId', (req, res) => { 
    const currentId=req.get('currentId');
    if ( currentId !== req.params.userId){
        res.status(403).send('you have no such permission on this list');
    }
    else {
        service.removeFromFavOf(req.params.cardId, currentId);
        res.send( JSON.stringify( cardListWithFavMark( service.getFavCardIdsOf(currentId), currentId ) ));
        //res.send('OK');
    }    
    
});

app.get('/prestored', (req, res) => { 
    const currentId = req.get('currentId');    
    res.send( JSON.stringify( cardListWithFavMark( service.getPrestoredCardIds(), currentId ) ) ); //
});


/*
app.delete('/prestored/:cardId', (req, res) => { 
    service.deleteCard(req.params.cardId);
    res.send('OK');
});
*/

app.get('/:userId/custom', (req, res) => { 
    const currentId = req.get('currentId');
    res.send( JSON.stringify( cardListWithFavMark( service.getCustomCardIdsOf(currentId), currentId ) ) );
});

app.post('/:userId/custom', (req, res) => {  
    const currentId=req.get('currentId');  
    if ( currentId !== req.params.userId){
        res.status(403).send('you have no such permission on this list');
    }
    else{ 
        let i= req.body.side0;
        let j= req.body.side1;
        if ( !i || !j ) res.status(400).send("neither side can be null");
        service.addCustomCardOf(i,j, currentId);
        //res.send('OK');
        res.send( JSON.stringify( cardListWithFavMark( service.getCustomCardIdsOf(currentId), currentId ) ) );
    }
});

app.delete('/:userId/custom/:cardId', (req, res) => { 
    const currentId=req.get('currentId');
    if (!service.ownsCard(currentId, req.params.cardId)){
        res.status(403).send('you have no such permission on this card');
    }
    else{
        service.deleteCard(req.params.cardId, currentId);
        //res.send('OK');
        res.send( JSON.stringify( cardListWithFavMark( service.getCustomCardIdsOf(currentId), currentId ) ) );
    }    
});

/*
app.get('/cards', (req, res) => { 
    const currentId=req.get('currentId');
    res.send( JSON.stringify( cardListWithFavMark( service.allCards, currentId ) ) );
    res.send( JSON.stringify( service.allCards ));
}); 
*/

app.get('/cards/:cardId', (req, res) => { 
    const currentId=req.get('currentId');
    res.send( JSON.stringify( getCardWithFavMark(req.params.cardId, currentId) ));
});

app.put('/cards/:cardId', (req, res) => { 
    const currentId=req.get('currentId');
    if (!service.ownsCard(currentId, req.params.cardId)){
        res.status(403).send('you have no such permission on this card');
    }
    else{
        let i= req.body.side0;
        let j= req.body.side1;
        if ( !i || !j ) res.status(400).send("neither side can be null");
        service.updateCard(req.params.cardId, i, j );
        //res.send('OK');
        res.send( JSON.stringify( getCardWithFavMark(req.params.cardId, currentId) ));
    }
});

function getCardWithFavMark( cardId, userId ){
    const card = service.getCardById(cardId);
    card.infav = service.isInFavOf(cardId, userId);
    return card;
}

function cardListWithFavMark( cardIdList, userId ){
    return cardIdList.map(cardId => getCardWithFavMark(cardId, userId) );
}

app.listen(PORT, () => {  
    console.log(`Server listening at http://localhost:${PORT}`);
    console.log('use Ctrl-C to stop this server');
});