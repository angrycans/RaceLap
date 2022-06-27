参考资料
1. https://github.com/micahpearlman/ZeroGPSLapTimer/blob/master/ZeroGPSLapTimer/arduino/gps_configure/gps_configure.ino
neogps 发送指令 参考
2. https://github.com/JimEli/gps_lap_timer
   https://github.com/JimEli/gps_lap_timer/blob/master/utility.h gps 工具内 线段相交 交点 终点线
3. https://github.com/gotzl/gps-tracker/blob/master/tracker/gps_tracker.hpp gps 终点偏移量另外一个算法 
4. https://create.arduino.cc/projecthub/guitar/gps-tacho-g-force-meter-accelerometer-1ea839 一个G值 计算参考 应该是sqrt(x2+y2+z2) 的方式

过终点算法
https://github.com/rgmorales/MiniLapTimer/blob/master/LapTimerMini.ino
https://github.com/tongo/OpenLapTimer/blob/master/Track.cpp
https://github.com/JimEli/gps_lap_timer/blob/master/utility.h



理论知识
1. https://www.datamc.org/data-acquisition/g-forces-and-acceleration/introduction-to-g-forces-and-acceleration/ datamc G值介绍
2. https://www.omnicalculator.com/physics/g-force#how-to-calculate-g-force G值计算公式
![](2022-06-27-15-00-37.png)
3. https://science.howstuffworks.com/science-vs-myth/everyday-myths/question633.htm 如何计算G值
4. https://convert-units.info/acceleration/g-force/0.319 G值转换到各单位计算器
 



电路知识
1. https://www.instructables.com/Arduino-Microcontroller-Self-Power-Off/ 开关电路
2. https://circuitjournal.com/arduino-auto-power-off 开关电路2 多了几个电阻


电阻色环查看器
https://www.digikey.sg/zh/resources/conversion-calculators/conversion-calculator-resistor-color-code



竞品
http://www.videovbox.cn/pc/productDetail11.html?index=10 vbox
https://www.vboxmotorsport.co.uk/index.php/us/ vbox
https://www.speedangle.com/ sa
http://www.gps-laptimer.de/ harry's laptimer
http://www.gps-laptimer.com/Add-ons3/Add-ons4.xml 全球赛道名称 harry's laptimer



