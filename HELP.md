**USRIOT RS232 to Ethernet converter USR-TCP232-302**

TCP232 is bi-directional, Ethernet to RS232 communication. Serial port data bits, stop bits, parity, and baud rate are set through the internal web page, with baud rates up to 230.4 Kbaud.

This is the generic command module.

If you are using the `Command` action, all serial data is passed through without interpretation or conversion.

If you use the `HEX based command` action, the hex values you enter will be converted and sent as binary data.

If a serial connector is not configured correctly, buffer overflows (indicating data loss), or parity errors will occur. `Settings such as Serial Work Mode, 7 data bit mode, or 2 stop bit mode are only accessible from the Serial web page.`

This module uses `TCP Server` mode, port 40302. The device defaults to `TCP Client` with no port set so this will need to be configured via the device web page before use.

Please make sure you have the proper baud rate settings, options, and serial cable that matches your serial device.

There is a configuration option to change how the commands are terminated to give you flexibility depending on application requirements:

  * Option 1: No Termination, does not alter your command at all.
  * Option 2: `\r` Carriage Return
  * Option 3: `\n` Line Feed
  * Option 4: `\r\n` Carriage Return and Line Feed

![Serial Parameters](images/serial.jpg?raw=true "serial parameters")
