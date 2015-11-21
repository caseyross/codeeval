var fs  = require("fs");
fs.readFileSync(process.argv[2]).toString().split('\n').forEach(function (line) {
    if (line != "") {
    	var seqs = line.trim().split(" | ");
    	var best_score = align(seqs[0], seqs[1])
    	console.log(best_score);
    	return 0;
    }
});

function align(seq1, seq2) {

	var scores = {
		match: 3,
		mismatch: -3,
		indel_start: -8,
		indel_ext: -1,
	}

	var i, j;
	
	var m = new Array(seq1.length + 1);
	for(i = 0; i < m.length; i ++) {
		m[i] = new Array(seq2.length + 1);
	}

	m[0][0] = 0;
	
	var l = new Array(seq1.length + 1);
	for(i = 0; i < l.length; i ++) {
		l[i] = new Array(seq2.length + 1);
	}
	var r = new Array(seq1.length + 1);
	for(i = 0; i < r.length; i ++) {
		r[i] = new Array(seq2.length + 1);
	}

	l[0][0] = -Infinity;
	r[0][0] = -Infinity;
	for(i = 1; i < seq1.length + 1; i ++) {
		l[i][0] = scores.indel_start + scores.indel_ext * (i-1);
		m[i][0] = -Infinity;
		r[i][0] = -Infinity;
	}
	for(j = 1; j < seq2.length + 1; j ++) {
		r[0][j] = scores.indel_start + scores.indel_ext * (j-1);
		m[0][j] = -Infinity;
		l[0][j] = -Infinity;
	}

	for(i = 1; i < seq1.length + 1; i ++) {
		for(j = 1; j < seq2.length + 1; j ++) {
			score(i, j);
		}
	}

	return Math.max(m[seq1.length][seq2.length], l[seq1.length][seq2.length], r[seq1.length][seq2.length]);

	function score(i, j) {
		l[i][j] = Math.max(m[i-1][j] + scores.indel_start, l[i-1][j] + scores.indel_ext);
		r[i][j] = Math.max(m[i][j-1] + scores.indel_start, r[i][j-1] + scores.indel_ext);
		m[i][j] = Math.max(m[i-1][j-1], l[i-1][j-1], r[i-1][j-1]) + match_score(i, j);
	}

	function match_score(i, j) {
		if(seq1[i-1] == seq2[j-1]) {
			return scores.match;
		}
		else {
			return scores.mismatch;
		}
	}
}