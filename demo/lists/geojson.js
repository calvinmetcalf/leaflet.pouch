function(head, req) {
    var row, out, sep = '\n';
    if (req.headers.Accept.indexOf('application/json')!=-1) {
        start({"headers":{"Content-Type" : "application/json"}});
    }    else {
        start({"headers":{"Content-Type" : "text/plain"}});
    }
    if ('callback' in req.query) {
        send(req.query['callback'] + "(");
    }    send('{"type": "FeatureCollection", "features":[');
    while (row = getRow()) {
        send(sep + JSON.stringify(row.value.geometry));        sep = ',\n';
    }
    send("]}");
    if ('callback' in req.query) {
        send(")");
	}
};