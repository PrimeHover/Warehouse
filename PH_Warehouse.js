/*:

 PH - Warehouse/Storage
 @plugindesc This plugin allows the creation of warehouses where you can store items in the game.
 @author PrimeHover
 @version 1.0.0
 @date 11/14/2015

 ---------------------------------------------------------------------------------------
 This work is licensed under the Creative Commons Attribution 4.0 International License.
 To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
 ---------------------------------------------------------------------------------------

 @param ---Vocabulary---
 @desc Use the spaces below to personalize the vocabulary of the plugin
 @default

 @param Withdraw Text
 @desc Text shown in option "Withdraw"
 @default Withdraw

 @param Deposit Text
 @desc Text shown in option "Deposit"
 @default Deposit

 @param Available Space Text
 @desc Text shown in the information window
 @default Available Space:

 @help

 Plugin Commands:

 - PHWarehouse create <Title of the Warehouse:50>               # Creates a warehouse with 50 spaces if it does not exist
 - PHWarehouse show <Title of the Warehouse>                    # Shows a warehouse
 - PHWarehouse remove <Title of the Warehouse>                  # Removes a warehouse

 The first command creates and opens a warehouse with the given title.
 If it already exists, the command will be ignored.
 Substitute "50" for the maximum number of spaces that the warehouse will have.
 If you leave the number in blank, the default size will be 50.
 Sizes cannot be changed.

 The second command opens the warehouse in the screen.

 The third command deletes an existent warehouse.
 Any remaining item in that specific warehouse will be removed as well.

 ========================================

 Script Calls: Use the commands below as a script command in a variable or conditional statement.

 - PHWarehouse.getMaxCapacity("Title of the Warehouse");        # Gets the maximum capacity of a warehouse (returns a number)
 - PHWarehouse.getCurrentCapacity("Title of the Warehouse");    # Gets the current capacity of a warehouse (returns a number)
 - PHWarehouse.exist("Title of the Warehouse");                 # Checks if a warehouse exists (returns true or false)

 */

/* Global variable for management of the warehouses */
var PHWarehouse;

(function() {

    /* Getting the parameters */
    var parameters = PluginManager.parameters('PH_Warehouse');
    var withdrawText = String(parameters['Withdraw Text']);
    var depositText = String(parameters['Deposit Text']);
    var availableSpaceText = String(parameters['Available Space Text']);

    /* ---------------------------------------------------------- *
     *                      WAREHOUSE MANAGER                     *
     * ---------------------------------------------------------- */

    function PHWarehouseManager() {
        this._warehouses = {};
        this._lastActive = "";
        this._lastOption = 0; // 0 = Withdraw, 1 = Deposit
        this._lastCategory = "item";
    }

    /* Creates a warehouse if it does not exist */
    PHWarehouseManager.prototype.createWarehouse = function(_sentence) {

        var matches = this.checkSentence(_sentence);
        var results;
        var title;
        var capacity = 50;

        if (matches != null) {
            results = matches[1].split(":");
            title = results[0];

            if (!this._warehouses.hasOwnProperty(title)) {

                if (results.length == 2) {
                    capacity = parseInt(results[1]);
                    if (isNaN(capacity) || capacity <= 0) {
                        capacity = 50;
                    }
                }

                this._warehouses[title] = {
                    title: title,
                    maxCapacity: capacity,
                    currentCapacity: 0,
                    items: {
                        item: [],
                        weapon: [],
                        armor: [],
                        keyItem: []
                    },
                    qtty: {
                        item: {},
                        weapon: {},
                        armor: {},
                        keyItem: {}
                    }
                };
            }

            this._lastActive = title;
        }

    };

    /* Opens a warehouse */
    PHWarehouseManager.prototype.openWarehouse = function(_sentence) {
        var matches = this.checkSentence(_sentence);
        if (matches != null) {
            this._lastActive = matches[1];
        }
    };

    /* Get all the items from the current warehouse */
    PHWarehouseManager.prototype.getItems = function() {
        var totalItems = this.getCommonItems();
        totalItems = totalItems.concat(this.getArmors());
        totalItems = totalItems.concat(this.getKeyItems());
        totalItems = totalItems.concat(this.getWeapons());
        return totalItems;
    };

    /* Get weapon items */
    PHWarehouseManager.prototype.getWeapons = function() {
        var totalItems = [];
        for (var i = 0; i < this._warehouses[this._lastActive].items.weapon.length; i++) {
            for (var j = 0; j < $dataWeapons.length; j++) {
                if ($dataWeapons[j] != null && this._warehouses[this._lastActive].items.weapon[i] == $dataWeapons[j].id) {
                    totalItems.push($dataWeapons[j]);
                }
            }
        }
        return totalItems;
    };

    /* Get common items */
    PHWarehouseManager.prototype.getCommonItems = function() {
        var totalItems = [];
        for (var i = 0; i < this._warehouses[this._lastActive].items.item.length; i++) {
            for (var j = 0; j < $dataItems.length; j++) {
                if ($dataItems[j] != null && this._warehouses[this._lastActive].items.item[i] == $dataItems[j].id) {
                    totalItems.push($dataItems[j]);
                }
            }
        }
        return totalItems;
    };

    /* Get armor items */
    PHWarehouseManager.prototype.getArmors = function() {
        var totalItems = [];
        for (var i = 0; i < this._warehouses[this._lastActive].items.armor.length; i++) {
            for (var j = 0; j < $dataArmors.length; j++) {
                if ($dataArmors[j] != null && this._warehouses[this._lastActive].items.armor[i] == $dataArmors[j].id) {
                    totalItems.push($dataArmors[j]);
                }
            }
        }
        return totalItems;
    };

    /* Get key items */
    PHWarehouseManager.prototype.getKeyItems = function() {
        var totalItems = [];
        for (var i = 0; i < this._warehouses[this._lastActive].items.keyItem.length; i++) {
            for (var j = 0; j < $dataItems.length; j++) {
                if ($dataItems[j] != null && this._warehouses[this._lastActive].items.keyItem[i] == $dataItems[j].id) {
                    totalItems.push($dataItems[j]);
                }
            }
        }
        return totalItems;
    };

    /* Get the quantity for the corresponding item */
    PHWarehouseManager.prototype.getQuantity = function(item) {
        return this._warehouses[this._lastActive].qtty[this._lastCategory][item.id];
    };

    /* Checks whether or not the warehouse is already full */
    PHWarehouseManager.prototype.checkCapacity = function() {
        if (this._warehouses[this._lastActive].currentCapacity < this._warehouses[this._lastActive].maxCapacity) {
            return true;
        }
        return false;
    };

    /* Deposit on warehouse */
    PHWarehouseManager.prototype.deposit = function(item) {
        if (this.checkCapacity()) {

            var hasItem = false;
            if (this._warehouses[this._lastActive].items[this._lastCategory].indexOf(item.id) > -1) {
                hasItem = true;
            }

            if (hasItem) {
                this._warehouses[this._lastActive].qtty[this._lastCategory][item.id]++;
            } else {
                this._warehouses[this._lastActive].items[this._lastCategory].push(item.id);
                this._warehouses[this._lastActive].qtty[this._lastCategory][item.id] = 1;
            }
            this._warehouses[this._lastActive].currentCapacity++;
        }

    };

    /* Withdraw from a warehouse */
    PHWarehouseManager.prototype.withdraw = function(item) {

        var hasItem = false;
        var index = this._warehouses[this._lastActive].items[this._lastCategory].indexOf(item.id);
        if (index > -1) {
            hasItem = true;
        }

        if (hasItem) {
            this._warehouses[this._lastActive].qtty[this._lastCategory][item.id]--;
            if (this._warehouses[this._lastActive].qtty[this._lastCategory][item.id] == 0) {
                this._warehouses[this._lastActive].items[this._lastCategory].splice(index, 1);
                delete this._warehouses[this._lastActive].qtty[this._lastCategory][item.id];
            }
            this._warehouses[this._lastActive].currentCapacity--;
        }

    };

    /* Remove a warehouse */
    PHWarehouseManager.prototype.removeWarehouse = function(_sentence) {

        var matches = this.checkSentence(_sentence);

        if (matches != null) {
            if (this._warehouses.hasOwnProperty(matches[1])) {
                delete this._warehouses[matches[1]];
            }
        }

    };

    /* Check sentences coming from the arguments */
    PHWarehouseManager.prototype.checkSentence = function(_sentence) {
        var regExp = /\<([^)]+)\>/;
        return regExp.exec(_sentence);
    };

    /* ACCESSOR METHODS */

    /* Return the value of the maximum capacity of the warehouse for the given title */
    PHWarehouseManager.prototype.getMaxCapacity = function(title) {
        if (this._warehouses.hasOwnProperty(title)) {
            return this._warehouses[title].maxCapacity;
        }
        return 0;
    };

    /* Return the value of the current capacity of the warehouse for the given title */
    PHWarehouseManager.prototype.getCurrentCapacity = function(title) {
        if (this._warehouses.hasOwnProperty(title)) {
            return this._warehouses[title].currentCapacity;
        }
        return 0;
    };

    /* Return whether or not the warehouse for the given title exists */
    PHWarehouseManager.prototype.exist = function(title) {
        if (this._warehouses.hasOwnProperty(title) && this._warehouses[title] !== undefined) {
            return true;
        }
        return false;
    };

    /* ---------------------------------------------------------- *
     *                      LOADING PROCESS                       *
     * ---------------------------------------------------------- */

    /*
     * Creating PHWarehouse variable after loading the whole database
     */
    var _DataManager_loadDatabase_ = DataManager.loadDatabase;
    DataManager.loadDatabase = function() {
        _DataManager_loadDatabase_.call(this);
        PHWarehouse = new PHWarehouseManager();
    };

    /* Saves the warehouses when the player saves the game */
    var _DataManager_makeSaveContents_ = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents_.call(this);
        contents.phwarehouse = PHWarehouse._warehouses;
        return contents;
    };

    /* Retrieve the warehouses from the save content */
    var _DataManager_extractSaveContents_ = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents_.call(this, contents);
        PHWarehouse = new PHWarehouseManager();
        PHWarehouse._warehouses = contents.phwarehouse;
    };

    var getAllArguments = function(args) {
        var str = args[1].toString();
        for (var i = 2; i < args.length; i++) {
            str += ' ' + args[i].toString();
        }
        return str;
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'PHWarehouse') {
            switch (args[0]) {
                case 'create':
                    PHWarehouse.createWarehouse(getAllArguments(args));
                    break;
                case 'show':
                    PHWarehouse.openWarehouse(getAllArguments(args));
                    SceneManager.push(Scene_Warehouse);
                    break;
                case 'remove':
                    PHWarehouse.removeWarehouse(getAllArguments(args));
                    break;
            }
        }
    };

    /* ---------------------------------------------------------- *
     *                       WINDOW PROCESS                       *
     * ---------------------------------------------------------- */

    function Window_WarehouseTitle() {
        this.initialize.apply(this, arguments);
    }
    Window_WarehouseTitle.prototype = Object.create(Window_Base.prototype);
    Window_WarehouseTitle.prototype.constructor = Window_WarehouseTitle;

    Window_WarehouseTitle.prototype.initialize = function() {
        Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, this.fittingHeight(1));
        this.refresh();
    };

    Window_WarehouseTitle.prototype.refresh = function() {
        this.contents.clear();
        this.changeTextColor(this.crisisColor());
        this.drawText(PHWarehouse._lastActive, 0, 0, Graphics.boxWidth, "center");
    };



    function Window_WarehouseOption() {
        this.initialize.apply(this, arguments);
    }
    Window_WarehouseOption.prototype = Object.create(Window_Selectable.prototype);
    Window_WarehouseOption.prototype.constructor = Window_WarehouseOption;

    Window_WarehouseOption.prototype.initialize = function() {
        Window_Selectable.prototype.initialize.call(this, 0, this.fittingHeight(1), Graphics.boxWidth, this.fittingHeight(1));
        this.withdrawText = withdrawText;
        this.depositText = depositText;
        this.refresh();
        this.select(0);
        this.activate();
    };

    Window_WarehouseOption.prototype.maxItems = function() {
        return 2;
    };

    Window_WarehouseOption.prototype.maxCols = function() {
        return 2;
    };

    Window_WarehouseOption.prototype.changeOption = function() {
        PHWarehouse._lastOption = this._index;
    };

    Window_WarehouseOption.prototype.refresh = function() {
        var rectWithdraw = this.itemRectForText(0);
        var rectDeposit = this.itemRectForText(1);
        this.drawText(this.withdrawText, rectWithdraw.x, rectWithdraw.y, rectWithdraw.width, "center");
        this.drawText(this.depositText, rectDeposit.x, rectDeposit.y, rectDeposit.width, "center");
    };



    function Window_WarehouseCategory() {
        this.initialize.apply(this, arguments);
    }
    Window_WarehouseCategory.prototype = Object.create(Window_ItemCategory.prototype);
    Window_WarehouseCategory.prototype.constructor = Window_WarehouseCategory;

    Window_WarehouseCategory.prototype.initialize = function() {
        Window_ItemCategory.prototype.initialize.call(this);
        this.y = this.fittingHeight(3);
        this.deselect();
        this.deactivate();
    };

    Window_WarehouseCategory.prototype.changeCategory = function() {
        PHWarehouse._lastCategory = this.currentSymbol() || "item";
    };

    Window_WarehouseCategory.prototype.setItemWindow = function(itemWindow) {
        this._itemWindow = itemWindow;
        this.update();
    };

    Window_WarehouseCategory.prototype.update = function() {
        Window_ItemCategory.prototype.update.call(this);
        this.changeCategory();
        this._itemWindow.refresh();
    };



    function Window_WarehouseItemList() {
        this.initialize.apply(this, arguments);
    }
    Window_WarehouseItemList.prototype = Object.create(Window_ItemList.prototype);
    Window_WarehouseItemList.prototype.constructor = Window_WarehouseItemList;

    Window_WarehouseItemList.prototype.initialize = function() {
        Window_ItemList.prototype.initialize.call(this, 0, this.fittingHeight(5), Graphics.boxWidth, Graphics.boxHeight - this.fittingHeight(7));
    };

    Window_WarehouseItemList.prototype.isCurrentItemEnabled = function() {
        if (this._data.length > 0) {
            if (PHWarehouse._lastOption == 1 && PHWarehouse.checkCapacity()) {
                return true;
            } else if (PHWarehouse._lastOption == 0) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    };

    Window_WarehouseItemList.prototype.makeWarehouseItemList = function() {
        var data = PHWarehouse.getItems();
        this._data = data.filter(function(item) {
            return this.includes(item);
        }, this);
        if (this.includes(null)) {
            this._data.push(null);
        }
    };

    Window_WarehouseItemList.prototype.loadItems = function() {

        // Deposit
        if (PHWarehouse._lastOption == 1) {
            this.makeItemList();
        }

        // Withdraw
        else if (PHWarehouse._lastOption == 0) {
            this.makeWarehouseItemList();
        }

    };

    Window_WarehouseItemList.prototype.drawItem = function(index) {
        var item = this._data[index];
        if (item) {
            var numberWidth = this.numberWidth();
            var rect = this.itemRect(index);
            rect.width -= this.textPadding();
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            if (PHWarehouse._lastOption == 1) {
                this.drawItemNumber(item, rect.x, rect.y, rect.width);
            } else if (PHWarehouse._lastOption == 0) {
                this.drawWarehouseItemNumber(item, rect.x, rect.y, rect.width);
            }
        }
    };

    Window_WarehouseItemList.prototype.drawWarehouseItemNumber = function(item, x, y, width) {
        var qtty = PHWarehouse.getQuantity(item);
        if (typeof Yanfly !== "undefined") {
            this.contents.fontSize = Yanfly.Param.ItemQuantitySize;
            this.drawText('\u00d7' + qtty, x, y, width, 'right');
            this.resetFontSettings();
        } else {
            this.drawText(':', x, y, width - this.textWidth('00'), 'right');
            this.drawText(qtty, x, y, width, 'right');
        }
    };

    Window_WarehouseItemList.prototype.refresh = function() {
        this.contents.clear();
        this.loadItems();
        this.drawAllItems();
    };

    Window_WarehouseItemList.prototype.moveItem = function() {

        // Deposit
        if (PHWarehouse._lastOption == 1) {
            if (PHWarehouse.checkCapacity()) {
                PHWarehouse.deposit(this.item());
                $gameParty.loseItem(this.item(), 1);
            }
        }

        // Withdraw
        else if (PHWarehouse._lastOption == 0) {
            PHWarehouse.withdraw(this.item());
            $gameParty.gainItem(this.item(), 1);
        }

    };



    function Window_WarehouseInfo() {
        this.initialize.apply(this, arguments);
    }
    Window_WarehouseInfo.prototype = Object.create(Window_Base.prototype);
    Window_WarehouseInfo.prototype.constructor = Window_WarehouseInfo;

    Window_WarehouseInfo.prototype.initialize = function() {
        Window_Base.prototype.initialize.call(this, 0, Graphics.boxHeight - this.fittingHeight(1), Graphics.boxWidth, this.fittingHeight(1));
        this.availableSpaceText = availableSpaceText + " ";
        this.refresh();
    };

    Window_WarehouseInfo.prototype.refresh = function() {
        this.contents.clear();
        this.availableSpaceValue = (PHWarehouse._warehouses[PHWarehouse._lastActive].maxCapacity - PHWarehouse._warehouses[PHWarehouse._lastActive].currentCapacity) + " / " + PHWarehouse._warehouses[PHWarehouse._lastActive].maxCapacity;
        this.changeTextColor(this.normalColor());
        this.drawText(this.availableSpaceText + this.availableSpaceValue, 0, 0, this.x);
    };


    /* ---------------------------------------------------------- *
     *                        SCENE PROCESS                       *
     * ---------------------------------------------------------- */

    function Scene_Warehouse() {
        this.initialize.apply(this, arguments);
    }

    Scene_Warehouse.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Warehouse.prototype.constructor = Scene_Warehouse;

    Scene_Warehouse.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_Warehouse.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);

        this.createTitle();
        this.createOptions();
        this.createCategory();
        this.createItemList();
        this.createInfoLocation();

    };

    Scene_Warehouse.prototype.createTitle = function() {
        this._titleWindow = new Window_WarehouseTitle();
        this.addWindow(this._titleWindow);
    };

    Scene_Warehouse.prototype.createOptions = function() {
        this._optionWindow = new Window_WarehouseOption();
        this._optionWindow.setHandler('cancel', this.popScene.bind(this));
        this._optionWindow.setHandler('ok', this.onOptionOk.bind(this));
        this.addWindow(this._optionWindow);
    };

    Scene_Warehouse.prototype.createCategory = function() {
        this._categoryWindow = new Window_WarehouseCategory();
        this._categoryWindow.setHandler('cancel', this.onCategoryCancel.bind(this));
        this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
        this.addWindow(this._categoryWindow);
    };

    Scene_Warehouse.prototype.createItemList = function() {
        this._itemWindow = new Window_WarehouseItemList();
        this._itemWindow.setHandler('ok', this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
        this._categoryWindow.setItemWindow(this._itemWindow);
    };

    Scene_Warehouse.prototype.createInfoLocation = function() {
        this._infoLocationWindow = new Window_WarehouseInfo();
        this.addWindow(this._infoLocationWindow);
    };

    Scene_Warehouse.prototype.onOptionOk = function() {
        this._optionWindow.changeOption();
        this._categoryWindow.activate();
        this._categoryWindow.select(0);
        this._optionWindow.deactivate();
    };

    Scene_Warehouse.prototype.onCategoryOk = function() {
        this._itemWindow.activate();
        if (this._itemWindow._data.length > 0) {
            this._itemWindow.select(0);
        }
        this._categoryWindow.deactivate();
    };

    Scene_Warehouse.prototype.onCategoryCancel = function() {
        this._categoryWindow.deselect();
        this._optionWindow.activate();
    };

    Scene_Warehouse.prototype.onItemCancel = function() {
        this._itemWindow.deselect();
        this._categoryWindow.activate();
    };

    Scene_Warehouse.prototype.onItemOk = function() {
        SoundManager.playEquip();
        this._itemWindow.moveItem();
        this._infoLocationWindow.refresh();
        this._itemWindow.activate();
    };

})();