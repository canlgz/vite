import React, { useState, useEffect, useRef } from 'react';

const QuantumCultureVis = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [entities, setEntities] = useState([]);
  const [params, setParams] = useState({
    timeStep: 0.5,
    quantumEffects: 0.3,
    culturalQuantumState: 0.2,
    enablePhysics: true,
    gravityConstant: 5,
    interactionRadius: 150,
    culturalRadius: 100,
    visualMode: 'physical'
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [quantumStatus, setQuantumStatus] = useState("確定性狀態");

  // 文化實體類
  class CulturalEntity {
    constructor(id, name, x, y) {
      this.id = id;
      this.name = name;
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.radius = 10;
      this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
      this.wavePoints = [];
      this.tradition = Math.random();
      this.innovation = Math.random();
      this.globalization = Math.random();
      this.localization = Math.random();
      this.history = [];
    }

    update(allEntities) {
      // 保存歷史位置
      if (this.history.length > 100) this.history.shift();
      this.history.push({ x: this.x, y: this.y });

      // 應用N體物理
      if (params.enablePhysics) {
        allEntities.forEach(other => {
          if (other.id === this.id) return;
          
          const dx = other.x - this.x;
          const dy = other.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 0 && dist < params.interactionRadius) {
            // 模擬引力或斥力
            const force = params.gravityConstant / (dist * dist);
            const fx = force * dx / dist;
            const fy = force * dy / dist;
            
            this.vx += fx * params.timeStep;
            this.vy += fy * params.timeStep;
            
            // 文化交流
            if (dist < params.culturalRadius) {
              this.tradition = this.tradition * 0.99 + other.tradition * 0.01;
              this.innovation = this.innovation * 0.99 + other.innovation * 0.01;
              this.globalization = this.globalization * 0.99 + other.globalization * 0.01;
              this.localization = this.localization * 0.99 + other.localization * 0.01;
            }
          }
        });
      }
      
      // 更新位置
      this.x += this.vx * params.timeStep;
      this.y += this.vy * params.timeStep;
      
      // 邊界檢查
      if (this.x < 0 || this.x > 800) this.vx *= -1;
      if (this.y < 0 || this.y > 600) this.vy *= -1;
      
      // 生成量子波函數
      if (params.quantumEffects > 0.5) {
        this.generateWaveFunction();
      } else {
        this.wavePoints = [];
      }
    }
    
    generateWaveFunction() {
      const points = [];
      const spread = params.quantumEffects * 30;
      
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * spread;
        const waveProbability = Math.exp(-(distance * distance) / (2 * spread * spread));
        
        points.push({
          x: this.x + Math.cos(angle) * distance,
          y: this.y + Math.sin(angle) * distance,
          probability: waveProbability
        });
      }
      
      this.wavePoints = points;
    }
  }
  
  // 初始化
  useEffect(() => {
    // 創建初始實體
    const initialEntities = [];
    for (let i = 0; i < 8; i++) {
      initialEntities.push(
        new CulturalEntity(
          i,
          `文化實體 ${i+1}`,
          Math.random() * 700 + 50,
          Math.random() * 500 + 50
        )
      );
    }
    setEntities(initialEntities);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // 動畫與繪製
  useEffect(() => {
    if (!canvasRef.current || entities.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      // 清除畫布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 繪製背景網格
      if (params.visualMode === 'physical') {
        drawGrid(ctx, canvas.width, canvas.height);
      }
      
      // 更新並繪製每個實體
      const updatedEntities = [...entities];
      updatedEntities.forEach(entity => {
        entity.update(updatedEntities);
      });
      
      // 繪製實體間的連線
      drawConnections(ctx, updatedEntities);
      
      // 繪製實體
      updatedEntities.forEach(entity => {
        drawEntity(ctx, entity);
      });
      
      // 繪製量子干涉效應
      if (params.visualMode === 'quantum' && params.quantumEffects > 0.5) {
        drawQuantumInterference(ctx, updatedEntities);
      }
      
      // 更新量子狀態
      updateQuantumStatus(updatedEntities);
      
      // 繼續動畫
      animationRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [entities, params]);
  
  // 繪製參考網格
  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 0.5;
    
    // 水平線
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // 垂直線
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  };
  
  // 繪製實體間的連線
  const drawConnections = (ctx, entities) => {
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entity1 = entities[i];
        const entity2 = entities[j];
        
        const dx = entity2.x - entity1.x;
        const dy = entity2.y - entity1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < params.interactionRadius) {
          // 計算文化相似度
          const similarity = calculateSimilarity(entity1, entity2);
          
          // 根據相似度和距離設置線條
          const alpha = Math.min(1, (params.interactionRadius - distance) / params.interactionRadius * similarity);
          ctx.strokeStyle = `rgba(100, 149, 237, ${alpha})`;
          ctx.lineWidth = alpha * 2;
          
          ctx.beginPath();
          ctx.moveTo(entity1.x, entity1.y);
          ctx.lineTo(entity2.x, entity2.y);
          ctx.stroke();
          
          // 量子模式下，高相似度實體間顯示量子糾纏
          if (params.visualMode === 'quantum' && similarity > 0.8) {
            const midX = (entity1.x + entity2.x) / 2;
            const midY = (entity1.y + entity2.y) / 2;
            
            ctx.fillStyle = 'rgba(255, 100, 255, 0.7)';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText("∞", midX, midY);
          }
        }
      }
    }
  };
  
  // 計算文化相似度
  const calculateSimilarity = (entity1, entity2) => {
    const traits = ['tradition', 'innovation', 'globalization', 'localization'];
    let similarity = 0;
    
    traits.forEach(trait => {
      similarity += 1 - Math.abs(entity1[trait] - entity2[trait]);
    });
    
    return similarity / traits.length;
  };
  
  // 繪製實體
  const drawEntity = (ctx, entity) => {
    // 繪製歷史軌跡
    if (params.visualMode === 'physical' && entity.history.length > 1) {
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(entity.history[0].x, entity.history[0].y);
      
      for (let i = 1; i < entity.history.length; i++) {
        ctx.lineTo(entity.history[i].x, entity.history[i].y);
      }
      
      ctx.stroke();
    }
    
    // 繪製量子波函數
    if (params.visualMode === 'quantum' && entity.wavePoints.length > 0) {
      entity.wavePoints.forEach(point => {
        ctx.fillStyle = `rgba(170, 100, 200, ${point.probability * 0.5})`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5 * point.probability, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    // 繪製主體
    if (params.visualMode === 'cultural') {
      // 文化模式使用特性作為顏色
      const r = Math.floor(entity.tradition * 255);
      const g = Math.floor(entity.innovation * 255);
      const b = Math.floor(entity.globalization * 255);
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    } else {
      ctx.fillStyle = entity.color;
    }
    
    ctx.beginPath();
    ctx.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 繪製名稱
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(entity.name, entity.x, entity.y - 15);
    
    // 文化模式繪製文化特性指示條
    if (params.visualMode === 'cultural') {
      const traits = [
        { name: 'tradition', color: '#ff595e' },
        { name: 'innovation', color: '#ffca3a' },
        { name: 'globalization', color: '#8ac926' },
        { name: 'localization', color: '#1982c4' }
      ];
      
      traits.forEach((trait, index) => {
        const value = entity[trait.name];
        const barWidth = 40 * value;
        
        ctx.fillStyle = trait.color;
        ctx.fillRect(entity.x - 20, entity.y + 15 + index * 5, barWidth, 3);
        
        // 量子態下顯示不確定性範圍
        if (params.culturalQuantumState > 0.5) {
          const uncertainty = params.culturalQuantumState * 0.3;
          const minValue = Math.max(0, value - uncertainty);
          const maxValue = Math.min(1, value + uncertainty);
          
          ctx.fillStyle = `${trait.color}44`; // 半透明
          ctx.fillRect(
            entity.x - 20 + (40 * minValue), 
            entity.y + 15 + index * 5, 
            40 * (maxValue - minValue), 
            3
          );
        }
      });
    }
  };
  
  // 繪製量子干涉
  const drawQuantumInterference = (ctx, entities) => {
    const gridSize = 20;
    const intensity = params.quantumEffects;
    
    for (let x = 0; x < canvasRef.current.width; x += gridSize) {
      for (let y = 0; y < canvasRef.current.height; y += gridSize) {
        let totalProbability = 0;
        let phase = 0;
        
        entities.forEach(entity => {
          const dx = x - entity.x;
          const dy = y - entity.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // 添加波函數貢獻
          totalProbability += (Math.cos(distance * intensity * 0.1) + 1) / (distance + 1);
          // 累積相位
          phase += distance * intensity * 0.1;
        });
        
        // 繪製干涉點
        if (totalProbability > 0.05) {
          // 使用相位影響顏色
          const hue = (phase * 30) % 360;
          ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${Math.min(totalProbability * 0.3, 0.2)})`;
          ctx.fillRect(x, y, gridSize - 2, gridSize - 2);
        }
      }
    }
    
    // 隨機量子坍縮效果
    if (params.quantumEffects > 0.7 && Math.random() < 0.01) {
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      
      // 繪製波紋
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      
      for (let r = 10; r <= 100; r += 20) {
        ctx.beginPath();
        ctx.arc(randomEntity.x, randomEntity.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      setStatusMessage("量子坍縮事件發生！");
      setTimeout(() => setStatusMessage(""), 2000);
    }
  };
  
  // 更新量子狀態
  const updateQuantumStatus = (entities) => {
    if (Math.random() < 0.05) {
      // 計算不確定度 - 基於實體文化特性的標準差
      let traditionVariance = 0;
      let innovationVariance = 0;
      
      // 計算平均值
      const traditionMean = entities.reduce((sum, e) => sum + e.tradition, 0) / entities.length;
      const innovationMean = entities.reduce((sum, e) => sum + e.innovation, 0) / entities.length;
      
      // 計算方差
      entities.forEach(e => {
        traditionVariance += Math.pow(e.tradition - traditionMean, 2);
        innovationVariance += Math.pow(e.innovation - innovationMean, 2);
      });
      
      const uncertainty = Math.sqrt((traditionVariance + innovationVariance) / (2 * entities.length));
      
      // 計算糾纏程度 - 基於相似實體對的數量
      let entangledPairs = 0;
      
      for (let i = 0; i < entities.length; i++) {
        for (let j = i + 1; j < entities.length; j++) {
          if (calculateSimilarity(entities[i], entities[j]) > 0.8) {
            entangledPairs++;
          }
        }
      }
      
      const entanglement = entangledPairs / (entities.length * (entities.length - 1) / 2);
      
      // 根據不確定度和糾纏程度決定量子狀態
      if (uncertainty < 0.1 && entanglement < 0.3) {
        setQuantumStatus("確定性狀態");
      } else if (uncertainty > 0.2 && entanglement < 0.3) {
        setQuantumStatus("疊加態");
      } else if (uncertainty < 0.1 && entanglement > 0.3) {
        setQuantumStatus("糾纏態");
      } else if (uncertainty > 0.2 && entanglement > 0.3) {
        setQuantumStatus("糾纏疊加複合態");
      }
    }
  };
  
  // 處理參數變化
  const handleParamChange = (name, value) => {
    setParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 重置系統
  const resetSystem = () => {
    const newEntities = [];
    for (let i = 0; i < 8; i++) {
      newEntities.push(
        new CulturalEntity(
          i,
          `文化實體 ${i+1}`,
          Math.random() * 700 + 50,
          Math.random() * 500 + 50
        )
      );
    }
    setEntities(newEntities);
    setStatusMessage("");
    setQuantumStatus("確定性狀態");
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-2">文化量子態互動視覺化系統</h1>
      <p className="text-center mb-2">從幾何編碼到生成文法的nBody文化體變</p>
      
      {/* 量子狀態顯示 */}
      <div className="text-center mb-4">
        <span className="font-semibold">量子狀態：</span> {quantumStatus}
        {statusMessage && (
          <div className="mt-1 bg-red-100 text-red-700 p-1 rounded">
            {statusMessage}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap">
        <div className="w-full lg:w-2/3 p-2">
          <div className="bg-white p-4 rounded shadow">
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={600} 
              className="w-full border border-gray-200"
            />
            
            <div className="mt-2 flex justify-center space-x-4">
              <button 
                onClick={() => handleParamChange('visualMode', 'physical')}
                className={`px-3 py-1 rounded ${params.visualMode === 'physical' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                物理模式
              </button>
              <button 
                onClick={() => handleParamChange('visualMode', 'cultural')}
                className={`px-3 py-1 rounded ${params.visualMode === 'cultural' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                文化模式
              </button>
              <button 
                onClick={() => handleParamChange('visualMode', 'quantum')}
                className={`px-3 py-1 rounded ${params.visualMode === 'quantum' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                量子模式
              </button>
              <button 
                onClick={resetSystem}
                className="px-3 py-1 rounded bg-red-500 text-white"
              >
                重置系統
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/3 p-2">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">系統參數控制</h3>
            
            <div className="mb-4">
              <label className="block mb-1">量子效應強度: {params.quantumEffects.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={params.quantumEffects} 
                onChange={(e) => handleParamChange('quantumEffects', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs">
                <span>確定性</span>
                <span>量子疊加</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">文化量子態: {params.culturalQuantumState.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={params.culturalQuantumState} 
                onChange={(e) => handleParamChange('culturalQuantumState', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs">
                <span>單一確定值</span>
                <span>多重疊加性</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">引力常數: {params.gravityConstant.toFixed(1)}</label>
              <input 
                type="range" 
                min="0" 
                max="10" 
                step="0.1" 
                value={params.gravityConstant} 
                onChange={(e) => handleParamChange('gravityConstant', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs">
                <span>弱相互作用</span>
                <span>強相互作用</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">互動半徑: {params.interactionRadius}</label>
              <input 
                type="range" 
                min="50" 
                max="300" 
                step="10" 
                value={params.interactionRadius} 
                onChange={(e) => handleParamChange('interactionRadius', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs">
                <span>局域影響</span>
                <span>全域影響</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={params.enablePhysics} 
                  onChange={(e) => handleParamChange('enablePhysics', e.target.checked)}
                  className="mr-2"
                />
                啟用nBody物理系統
              </label>
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold mb-2">量子文化解析</h3>
              <div className="text-sm">
                <p className="mb-2">本系統模擬了從「確定性座標」到「量子態文化」的範式轉移：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>物理模式</strong>：展示笛卡爾確定性座標系統，實體具有明確位置和軌跡</li>
                  <li><strong>文化模式</strong>：顯示實體的文化特性和相互影響，展現關係本體論</li>
                  <li><strong>量子模式</strong>：呈現量子疊加和干涉現象，體現不確定性原理</li>
                </ul>
                
                <h4 className="font-semibold mt-3 mb-1">量子特性對應：</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>疊加</strong>：文化特性不再是單一值，而是多個可能性同時存在</li>
                  <li><strong>坍縮</strong>：觀測行為導致多種可能性坍縮為特定狀態</li>
                  <li><strong>不確定性</strong>：文化價值的模糊性和流動性</li>
                  <li><strong>非局域糾纏</strong>：遠距離實體間的即時影響與關聯</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumCultureVis;