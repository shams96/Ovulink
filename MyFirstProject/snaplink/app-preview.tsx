import React, { useState } from 'react';

const AppPreview = () => {
  const [activeScreen, setActiveScreen] = useState('home');
  
  // Format time ago helper function
  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };
  
  return (
    <div style={{display: 'flex', gap: '24px', padding: '20px', maxWidth: '1000px'}}>
      {/* Phone Mockup */}
      <div style={{
        width: '320px',
        height: '650px',
        backgroundColor: '#fff',
        borderRadius: '36px',
        border: '12px solid #333',
        overflow: 'hidden',
        boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.15)',
        position: 'relative'
      }}>
        {/* App Content */}
        <div style={{height: '100%', overflowY: 'auto'}}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            borderBottom: '1px solid #f5f5f5'
          }}>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#7C4DFF'}}>SnapLink</div>
            <div style={{
              width: '40px', 
              height: '40px', 
              borderRadius: '20px',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>📷</div>
          </div>
          
          {/* Live Widgets Section */}
          <div style={{padding: '16px'}}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div style={{fontSize: '18px', fontWeight: 'bold'}}>Live Widgets</div>
              <div>⚙️</div>
            </div>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '24px'
            }}>
              {/* Widget 1 */}
              <div style={{
                width: 'calc(50% - 4px)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300" 
                  alt="Coffee"
                  style={{width: '100%', height: '120px', objectFit: 'cover'}}
                />
                <div style={{padding: '8px'}}>
                  <div style={{fontWeight: 'bold', fontSize: '14px'}}>Alex</div>
                  <div style={{fontSize: '12px', color: '#888'}}>15m ago</div>
                </div>
              </div>
              
              {/* Widget 2 */}
              <div style={{
                width: 'calc(50% - 4px)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1552083375-1447ce886485?w=400&h=300" 
                  alt="Sunset"
                  style={{width: '100%', height: '120px', objectFit: 'cover'}}
                />
                <div style={{padding: '8px'}}>
                  <div style={{fontWeight: 'bold', fontSize: '14px'}}>Sarah</div>
                  <div style={{fontSize: '12px', color: '#888'}}>1h ago</div>
                </div>
              </div>
            </div>
            
            {/* Daily Challenge */}
            <div style={{
              backgroundColor: '#F3F0FF',
              borderRadius: '12px',
              padding: '16px',
              borderLeft: '4px solid #7C4DFF',
              marginBottom: '24px'
            }}>
              <div style={{fontSize: '16px', marginBottom: '16px'}}>
                What's your workspace looking like today?
              </div>
              <button style={{
                backgroundColor: '#7C4DFF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                Respond Now
              </button>
            </div>
            
            {/* Recent Snaps Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <div style={{fontSize: '18px', fontWeight: 'bold'}}>Recent Snaps</div>
            </div>
            
            {/* Snap Card */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '16px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&h=300" 
                alt="Nature"
                style={{width: '100%', height: '180px', objectFit: 'cover'}}
              />
              <div style={{padding: '12px'}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                  <img 
                    src="https://api.dicebear.com/6.x/personas/svg?seed=Sarah" 
                    alt="Sarah"
                    style={{width: '40px', height: '40px', borderRadius: '20px', marginRight: '12px'}}
                  />
                  <div>
                    <div style={{fontWeight: 'bold', fontSize: '16px'}}>Sarah Kim</div>
                    <div style={{fontSize: '12px', color: '#888'}}>30m ago</div>
                  </div>
                </div>
                <div style={{marginBottom: '12px'}}>
                  Beautiful sunset at the beach today! 🌅
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    color: '#FF6B6B',
                    fontSize: '12px'
                  }}>
                    Disappears soon
                  </div>
                  <div style={{fontSize: '14px', color: '#666'}}>2 👍</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: '#fff',
          display: 'flex',
          borderTop: '1px solid #eee'
        }}>
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{fontSize: '24px', color: '#7C4DFF'}}>🏠</div>
            <div style={{fontSize: '12px', color: '#7C4DFF', fontWeight: 'bold'}}>Home</div>
          </div>
          
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{fontSize: '24px', color: '#888'}}>👥</div>
            <div style={{fontSize: '12px', color: '#888'}}>Friends</div>
          </div>
          
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{fontSize: '24px', color: '#888'}}>👤</div>
            <div style={{fontSize: '12px', color: '#888'}}>Profile</div>
          </div>
        </div>
      </div>
      
      {/* App Info */}
      <div style={{maxWidth: '500px'}}>
        <h1 style={{color: '#333', marginTop: 0}}>SnapLink - Share Authentic Moments</h1>
        <p style={{color: '#666', lineHeight: 1.5}}>
          A next-generation social sharing app designed as an improved alternative to BeReal. 
          SnapLink prioritizes genuine connections, spontaneity, and ease of use without the 
          pressure of social media.
        </p>
        
        <div style={{marginTop: '32px'}}>
          <div style={{display: 'flex', marginBottom: '24px'}}>
            <div style={{fontSize: '32px', marginRight: '16px'}}>⏱️</div>
            <div>
              <h3 style={{margin: '0 0 8px 0'}}>Smart Timing, Not Random Pressure</h3>
              <p style={{margin: 0, color: '#666'}}>
                Set preferred time windows when you're typically available, with AI suggesting 
                optimal times based on friends' patterns.
              </p>
            </div>
          </div>
          
          <div style={{display: 'flex', marginBottom: '24px'}}>
            <div style={{fontSize: '32px', marginRight: '16px'}}>📱</div>
            <div>
              <h3 style={{margin: '0 0 8px 0'}}>Live Widget Sharing</h3>
              <p style={{margin: 0, color: '#666'}}>
                Send instant snapshots to a small group of best friends, appearing live 
                on their home screen widget.
              </p>
            </div>
          </div>
          
          <div style={{display: 'flex'}}>
            <div style={{fontSize: '32px', marginRight: '16px'}}>🔒</div>
            <div>
              <h3 style={{margin: '0 0 8px 0'}}>Flexible Sharing & Privacy Controls</h3>
              <p style={{margin: 0, color: '#666'}}>
                Post to specific friend groups with auto-private mode where posts disappear 
                after a few hours unless saved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPreview;
