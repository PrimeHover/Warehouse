# PH_Warehouse.js
Warehouses for RPG Maker MV
*created by PrimeHover*

### Installation
* Download the JS file and include it into the ```/plugins``` folder of your project.
* Open the Plugin Manager, select the file **PH_Warehouse.js**, and turn it on.

### Parameters
* ``Withdraw Text``:  Text shown in option "Withdraw".
* ``Deposit Text``: Text shown in option "Deposit".
* ``Available Space Text``: Text shown in the information window.

### Plugin Commands
* ``PHWarehouse create <Title of the Warehouse:50>``: Creates a warehouse with 50 spaces if it does not exist. Substitute "50" for the maximum number of spaces that the warehouse will have. If you leave the number in blank, the default size will be 50.
* ``PHWarehouse show <Title of the Warehouse>``: Shows a warehouse on the screen.
* ``PHWarehouse remove <Title of the Warehouse>``: Removes a warehouse and its remaining items.

### Script Calls
* ``PHWarehouse.getMaxCapacity("Title of the Warehouse")``: Gets the maximum capacity of a warehouse (returns a number).
* ``PHWarehouse.getCurrentCapacity("Title of the Warehouse")``: Gets the current capacity of a warehouse (returns a number).
* ``PHWarehouse.exist("Title of the Warehouse")``: Checks if a warehouse exists (returns true or false).

### How to Use
* Just install the plugin and turn it on.

### ChangeLog
* 11/14/2015: Version 1.0
