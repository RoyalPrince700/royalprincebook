import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: 'var(--card-bg)',
      borderTop: '1px solid var(--border-color)',
      padding: '2rem 0 1rem 0',
      marginTop: 'auto',
      color: 'var(--text-secondary)',
      fontSize: '0.9rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Brand Section */}
          <div>
            <Link
              to="/dashboard"
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <h3 style={{
                margin: '0 0 1rem 0',
                color: 'var(--text-primary)',
                fontSize: '1.2rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
              >
                Royal Prince Book
              </h3>
            </Link>
            <p style={{
              margin: '0 0 1rem 0',
              lineHeight: '1.6',
              color: 'var(--text-secondary)'
            }}>
              A sophisticated platform for AI-assisted book creation, where ideas transform into beautifully formatted manuscripts ready for publication.
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h4 style={{
              margin: '0 0 1rem 0',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Features
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <li>AI-Powered Content Generation</li>
              <li>Chapter-Based Organization</li>
              <li>Real-Time Preview</li>
              <li>Multiple Export Formats</li>
              <li>Code-Based Editing</li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h4 style={{
              margin: '0 0 1rem 0',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Resources
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <li>
                <a
                  href="#"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  Writing Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 style={{
              margin: '0 0 1rem 0',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: '500'
            }}>
              Connect
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <li>
                <a
                  href="mailto:contact@royalprincebook.com"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  contact@royalprincebook.com
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            © {currentYear} Royal Prince Book. All rights reserved.
          </div>
          <div style={{
            display: 'flex',
            gap: '1rem',
            fontSize: '0.85rem'
          }}>
            <a
              href="#"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;