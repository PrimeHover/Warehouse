# PH_Warehouse.js
Warehouses for RPG Maker MV     
*created by PrimeHover*

### License
* This work is licensed under the Creative Commons Attribution 4.0 International License.
* To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
* If this plugin is very useful to you and you want to help this plugin to keep improving, consider making a small donation using the link below:     
[![](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Q7CRGSXWBSP22)

### Installation
* Download the JS file and include it into the ```/plugins``` folder of your project.
* Open the Plugin Manager, select the file **PH_Warehouse.js**, and turn it on.

### How to Use
* You can check out an illustrative example about how to use the commands and rule [HERE](http://forums.rpgmakerweb.com/index.php?/topic/50503-ph-warehousestorage/).

### Parameters
* ``All Together``: Defines whether or not you want to show the items in separated categories (0: false, 1: true).
* ``Stack Item Quantity``: Defines whether or not you want to consider stacked items as a single space in the capacity (0: false, 1: true).
* ``Withdraw Text``: Text shown in option "Withdraw".
* ``Deposit Text``: Text shown in option "Deposit".
* ``Available Space Text``: Text shown in option "All" if the parameter "All Together" is set as true.
* ``All Text``: Text shown in the information window.

### Plugin Commands
* ``PHWarehouse create <Title of the Warehouse:50:rule>``: Creates a warehouse with 50 spaces if it does not exist. Substitute "50" for the maximum number of spaces that the warehouse will have. Substitute "rule" for the name of the rule you want to apply. If you leave the number in blank, the default size will be 50. If you leave the rule in blank, no rule will be applied.
* ``PHWarehouse show <Title of the Warehouse>``: Shows a warehouse on the screen.
* ``PHWarehouse remove <Title of the Warehouse>``: Removes a warehouse and its remaining items.
* ``PHWarehouse loot item <Title of the Warehouse:id:quantity>``: Add an item for loot bonus inside a created warehouse.
* ``PHWarehouse loot weapon <Title of the Warehouse:id:quantity>``: Add a weapon for loot bonus inside a created warehouse.
* ``PHWarehouse loot armor <Title of the Warehouse:id:quantity>``: Add an armor for loot bonus inside a created warehouse.
* ``PHWarehouse loot keyItem <Title of the Warehouse:id:quantity>``: Add a key item for loot bonus inside a created warehouse.
* ``PHWarehouse add item <Title of the Warehouse:id:quantity>``: Add an item immediately inside a created warehouse.
* ``PHWarehouse add weapon <Title of the Warehouse:id:quantity>``: Add a weapon immediately inside a created warehouse.
* ``PHWarehouse add armor <Title of the Warehouse:id:quantity>``: Add an armor immediately inside a created warehouse.
* ``PHWarehouse add keyItem <Title of the Warehouse:id:quantity>``: Add a key item immediately inside a created warehouse.
* ``PHWarehouse capacity set <Title of the Warehouse:quantity>``: Set a new maximum capacity for a warehouse already created.
* ``PHWarehouse capacity increase <Title of the Warehouse:quantity>``: Increase the maximum capacity for a warehouse already created.
* ``PHWarehouse capacity decrease <Title of the Warehouse:quantity>``: Decrease the maximum capacity for a warehouse already created.

### Script Calls
* ``PHPlugins.PHWarehouse.getMaxCapacity("Title of the Warehouse")``: Gets the maximum capacity of a warehouse (returns a number).
* ``PHPlugins.PHWarehouse.getCurrentCapacity("Title of the Warehouse")``: Gets the current capacity of a warehouse (returns a number).
* ``PHPlugins.PHWarehouse.exist("Title of the Warehouse")``: Checks if a warehouse exists (returns true or false).
* ``PHPlugins.PHWarehouse.hasItem("Title of the Warehouse", id);``: Verifies if a warehouse has a particular item and returns the quantity of this item inside the warehouse.
* ``PHPlugins.PHWarehouse.hasWeapon("Title of the Warehouse", id);``: Verifies if a warehouse has a particular weapon and returns the quantity of this item inside the warehouse.
* ``PHPlugins.PHWarehouse.hasArmor("Title of the Warehouse", id);``: Verifies if a warehouse has a particular armor and returns the quantity of this item inside the warehouse.
* ``PHPlugins.PHWarehouse.hasKeyItem("Title of the Warehouse", id);``: Verifies if a warehouse has a particular key item and returns the quantity of this item inside the warehouse.

### Rule Configuration
Rules are a simple way to manage which items you can store in a specific warehouse.
In order to create a rule for your warehouse, you have to create a Common Event in the database called "PHWarehouse".
Inside of that Common Event, you will create some comments in order to populate the rules for warehouses.
These comments must have the following format:

``{Title of the Rule}``    
``[commands]``

The ``[commands]`` you can specify are as follow:

* ``item: 1`` (Just allow the storage of the item with id 1)
* ``item: 1, 2, 3, 4`` (Allows the storage of items with id 1, 2, 3 and 4)
* ``item: no`` (Does not allow the storage of items)
* ``item-n: 1`` (Allows the storage of any item except the one with id 1)
* (If you don't specify the command "item" in the rule, all items will be allowed to be stored)

* ``weapon: 1`` (Just allow the storage of the weapon with id 1)
* ``weapon: 1, 2, 3, 4`` (Allows the storage of weapons with id 1, 2, 3 and 4)
* ``weapon: no`` (Does not allow the storage of weapons)
* ``weapon-n: 1`` (Allows the storage of any weapon except the one with id 1)
* (If you don't specify the command "weapon" in the rule, all weapons will be allowed to be stored)

* ``armor: 1`` (Just allow the storage of the armor with id 1)
* ``armor: 1, 2, 3, 4`` (Allows the storage of armors with id 1, 2, 3 and 4)
* ``armor: no`` (Does not allow the storage of armors)
* ``armor-n: 1`` (Allows the storage of any armor except the one with id 1)
* (If you don't specify the command "armor" in the rule, all armors will be allowed to be stored)

* ``keyItem: 1`` (Just allow the storage of the key item with id 1)
* ``keyItem: 1, 2, 3, 4`` (Allows the storage of key items with id 1, 2, 3 and 4)
* ``keyItem: no`` (Does not allow the storage of key items)
* ``keyItem-n: 1`` (Allows the storage of any key item except the one with id 1)
* (If you don't specify the command "keyItem" in the rule, all key items will be allowed to be stored)

### ChangeLog
* 05/30/2016: Version 1.2.1 (Stack items as a single space in your storage. Increase/Decrease the maximum capacity of a warehouse. Bug fixes).
* 05/29/2016: Version 1.2 (All Together option allows you to see all the items in just one category. It also provides compatibility with ``Shaz_NoCategory`` and ``MrTS_LimitedInventory`` plugins).
* 11/19/2015: Bug fixed in the global variable that receives the parameters. Also, a small modification in the Script commands.
* 11/17/2015: Version 1.1
* 11/16/2015: Fixed issue that allowed items remain in the storage after initiating a new game.
* 11/14/2015: Version 1.0
