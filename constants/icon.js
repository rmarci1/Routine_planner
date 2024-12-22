import {Entypo,AntDesign,Feather,FontAwesome,MaterialCommunityIcons,FontAwesome5,MaterialIcons,Ionicons,FontAwesome6 } from '@expo/vector-icons';

export const getIcon = (icon,text_color,size) => {
    const [group, name] = icon.split(",", 2);
    switch(group){
      case "AntDesign" :
          return <AntDesign name={name} size={size? size :18} color={text_color}/>
      case "Entypo" :
          return <Entypo name={name} size={size? size :18} color={text_color}/>
      case "Feather" :
          return <Feather name={name} size={size? size :18} color={text_color}/>
      case "FontAwesome" :
          return <FontAwesome name={name} size={size? size :18} color={text_color}/>
      case "MaterialCommunityIcons" : 
          return <MaterialCommunityIcons name={name} size={size? size :18} color={text_color}/>
      case "FontAwesome5" : 
          return <FontAwesome5 name={name} size={size? size :18} color={text_color}/>
      case "MaterialIcons" : 
          return <MaterialIcons name={name} size={size? size :18} color={text_color}/>
      case "Ionicons" : 
          return <Ionicons name={name} size={size? size :18} color={text_color}/>
      case "FontAwesome6" : 
          return <FontAwesome6 name={name} size={size? size :18} color={text_color}/>
    
    }
}
