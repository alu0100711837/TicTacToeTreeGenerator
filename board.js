frame = document.getElementById('frame');

class Board {

    constructor(values) {
        this.values = values;
        this.node = { };
        this.parentNode;
        this.node.innerHTML = this.paint();
        this.victory = true;
    }

    getPermutationValues(newValue) {
        var permutationValues = [];
        var index = 0;
        while (index < this.values.length) {
            if (this.values[index] == 0) {
                var auxBoard = this.values.slice();
                auxBoard[index] = newValue;
                permutationValues.push(auxBoard);
            }
            index++;
        }
        return permutationValues;
    }

    setChilds(childs) {
        this.childs = childs;
    }

    getPermutationBoards(newValue) {
        var values = this.getPermutationValues(newValue);
        var boards = [];
        values.forEach(function(value) {
            boards.push(new Board(value))
        });
        return boards;
    }

    checkVictory() {
        var victory;
        victory = this.checkVictoryHorizontal();
        if (victory != false) {return victory}

        victory = this.checkVictoryVertical();
        if (victory != false) {return victory}

        victory = this.checkVictoryDiagonal();
        if (victory != false) {return victory}

        victory = this.checkVictorySecDiagonal();
        if (victory != false) {return victory}

        return false;
    }

    checkVictoryHorizontal() {
        for (var i = 0; i < 3; i++) {
            if ((this.values[this.pos(i, 0)] == this.values[this.pos(i, 1)]) && (this.values[this.pos(i, 0)]  == this.values[this.pos(i, 2)])) {
                    if (this.values[this.pos(i, 0)] != 0) { return this.values[this.pos(i, 0)] };
            }
        }
        return false;
    }

    checkVictoryVertical() {
        for (var i = 0; i < 3; i++) {
            if ((this.values[this.pos(0, i)] == this.values[this.pos(1, i)]) && (this.values[this.pos(0, i)]  == this.values[this.pos(2, i)])) {
                if (this.values[this.pos(0, i)] != 0) {return this.values[this.pos(0, i)]};
            }
        }
        return false;  
    }

    checkVictoryDiagonal() {
        if ((this.values[this.pos(0, 0)] == this.values[this.pos(1, 1)]) && (this.values[this.pos(0, 0)]  == this.values[this.pos(2, 2)])) {
            if (this.values[this.pos(0, 0)] != 0) {return this.values[this.pos(0, 0)]};
        }
        return false;
    }

    checkVictorySecDiagonal() {
        if ((this.values[this.pos(0, 2)] == this.values[this.pos(1, 1)]) && (this.values[this.pos(0, 2)]  == this.values[this.pos(2, 0)])) {
            if (this.values[this.pos(0, 2)] != 0) {return this.values[this.pos(0, 2)]};
        }
        return false;
    }

    pos(i, j) {
        return (i * 3) + j;
    }

    paint() {
        var container = document.createElement('div');
        var board = document.createElement('div');
        board.className = 'board';
        this.values.forEach(function(value) {
            var cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = value;
            //Comment the next lines for seeing values instead of 'X' and 'O'
            if (value == 0) { cell.textContent = ' '}
            if (value == 1) { cell.textContent = 'X'}
            if (value == 2) { cell.textContent = 'O'}
            board.appendChild(cell);
        });

        var result = this.checkVictory();
        if (result == 1) { board.classList.add('victory') }
        if (result == 2) { board.classList.add('lose') }

        container.appendChild(board);
        return container.innerHTML
    }
}

class Tree {

    constructor(parentBoard) {
        this.parentBoard = parentBoard;
        this.levels = [ [], [], [], [], [], [], [], [], [], [] ]
        this.levels[0].push(parentBoard);
        this.generateTree();
    }

    generateLevel(levelIndex) {
        var levelList = [];
        this.levels[levelIndex - 1].forEach(function(board) {
            var auxBoards = board.getPermutationBoards((levelIndex % 2) + 1);
            if (board.checkVictory() == false) {
                board.victory = false;
                board.setChilds(auxBoards)
                auxBoards.forEach(function(auxBoard) {
                auxBoard.parentNode = board.node;
                levelList.push(auxBoard);
            });
        }
        });
        for (var i = 0; i < levelList.length; i++) {
            this.levels[levelIndex].push(levelList[i]);
        }
    }

    generateTree() {
        for (var i = 1; i <= this.parentBoard.values.length - 1; i++) {
            this.generateLevel(i);
        }
    }

}


class TreeDrawer {

    constructor(tree) {
        this.tree = tree;
        this.simple_chart_config =  [];
    }


    createChart()
    {
        var config = {
            container: '#tree-simple',
            rootOrientation: 'NORTH',
            levelSeparation: 80,
            siblingSeparation: 10,
            node: { collapsable: 'True',  },
            connectors: { style: { stroke: 'white' } },
            scrollbar: 'fancy',
        };
        this.simple_chart_config.push(config);
        this.simple_chart_config.push(this.tree.parentBoard.node)

        for (var i = 1; i < this.tree.levels.length; i++) {
            for (var j = 0; j < this.tree.levels[i].length; j++) {
                    var child_node = this.tree.levels[i][j].node;
                    child_node.parent = this.tree.levels[i][j].parentNode;
                    this.simple_chart_config.push(child_node)
            }
        }
        this.tree.parentBoard.node.collapsed = true;
        this.Treant = new Treant(this.simple_chart_config)
    }
}


values = [0, 1, 2,
          1, 1, 2,
          0, 0, 0];
board = new Board(values);
treedrawer = new TreeDrawer(new Tree(board));
treedrawer.createChart();
