oS.Init({PName:[oPeashooter,oSunFlower,oCherryBomb,oWallNut,oPotatoMine,oSnowPea,oChomper,oRepeater,oPuffShroom,oSunShroom,oPumpkinHead,oSquash,oFumeShroom,oGloomShroom,oGarlic],ZName:[oZombie,oConeheadZombie,oNewspaperZombie,oBucketheadZombie],PicArr:function(){var a=oFumeShroom.prototype,b=a.PicArr;return["images/interface/background2.jpg","images/interface/Tombstones.png","images/interface/Tombstone_mounds.png",b[a.CardGif],b[a.NormalGif]]}(),backgroundImage:"images/interface/background2.jpg",CanSelectCard:1,DKind:0,SunNum:100,LevelName:"小游戏：乱葬岗",LargeWaveFlag:{10:$Cfun("imgFlag3"),20:$Cfun("imgFlag2"),30:$Cfun("imgFlag1")},Monitor:{f:AppearTombstones,ar:[5,9,12]},UserDefinedFlagFunc:function(b){var a=oP.FlagZombies;switch(true){case a>20:oP.SetTimeoutTomZombie([oConeheadZombie,oConeheadZombie,oBucketheadZombie]);break;case a>15:oP.SetTimeoutTomZombie([oZombie,oConeheadZombie,oBucketheadZombie]);break;case a>10:oP.SetTimeoutTomZombie([oZombie,oConeheadZombie]);break;case a>5:oP.SetTimeoutTomZombie([oZombie])}},LoadMusic:function(){NewEle("oEmbed","embed","width:0;height:0",{src:"music/Look up at the.mp3"},EDAll)},StartGameMusic:"Ultimate battle.mp3"},{ArZ:[oZombie,oZombie,oZombie,oConeheadZombie,oConeheadZombie,oNewspaperZombie,oNewspaperZombie,oNewspaperZombie,oBucketheadZombie,oBucketheadZombie],FlagNum:30,SumToZombie:{1:3,2:8,3:10,"default":10},FlagToSumNum:{a1:[3,5,9,10,13,15,19,20,23,25,29],a2:[1,2,3,10,4,5,6,15,7,8,9,25]},FlagToMonitor:{9:[ShowLargeWave,0],19:[ShowLargeWave,0],29:[ShowFinalWave,0]}});