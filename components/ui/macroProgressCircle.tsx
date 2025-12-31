import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface MacroProgressCircleProps {
  value: number;
  target: number;
  color: string;
  label: string;
}

const MacroProgressCircle = ({ value, target, color, label }: MacroProgressCircleProps) => {
  const size = 80;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progress = Math.min(value / (target || 1), 1); 
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <View style={{ alignItems: 'center', marginHorizontal: 5 }}>
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          
          {/* Cerchio di sfondo (grigio chiaro o il colore trasparente) */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeOpacity={0.3} 
            fill="transparent"
          />
          
          {/* Cerchio di progresso (colorato) */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
        
        {/* Testo al centro */}
        <View>
          <ThemedText type='defaultSemiBold'>
            {Math.round(value)}g
          </ThemedText>
        </View>
      </View>
      
      {/* Etichetta sotto il cerchio */}
      <ThemedText style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
        {label}
      </ThemedText>
    </View>
  );
};

export default MacroProgressCircle;