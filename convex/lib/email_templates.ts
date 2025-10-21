export function contactConfirmationEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kiitos yhteydenotosta</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #020617;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020617;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 8px; overflow: hidden;">
              
              <!-- Header with brand color -->
              <tr>
                <td style="background-color: #14b8a6; padding: 40px 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600;">
                    Improtango
                  </h1>
                </td>
              </tr>
              
              <!-- Main content -->
              <tr>
                <td style="padding: 40px 40px 30px;">
                  <h2 style="margin: 0 0 20px; color: #f8fafc; font-size: 24px; font-weight: 600;">
                    Kiitos yhteydenotostasi, ${name}!
                  </h2>
                  <p style="margin: 0 0 16px; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                    Olemme vastaanottaneet viestisi ja palaamme asiaan mahdollisimman pian.
                  </p>
                  <p style="margin: 0 0 16px; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                    Jos asiasi on kiireellinen, voit myös ottaa meihin yhteyttä suoraan sähköpostitse:
                  </p>
                  <p style="margin: 0 0 24px;">
                    <a href="mailto:info@improtango.fi" style="color: #14b8a6; text-decoration: none; font-weight: 600;">
                      info@improtango.fi
                    </a>
                  </p>
                </td>
              </tr>
              
              <!-- Divider -->
              <tr>
                <td style="padding: 0 40px;">
                  <div style="height: 1px; background-color: #1e293b;"></div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px 40px;">
                  <p style="margin: 0 0 12px; color: #94a3b8; font-size: 14px;">
                    Lämpimin terveisin,<br>
                    <span style="color: #f8fafc; font-weight: 600;">Minna Tuovinen & Martin Heslop</span>
                  </p>
                  <p style="margin: 20px 0 0; color: #64748b; font-size: 12px;">
                    <a href="https://info.improtango.fi" style="color: #14b8a6; text-decoration: none;">
                      info.improtango.fi
                    </a>
                    &nbsp;•&nbsp;
                    <a href="https://improtango.fi" style="color: #14b8a6; text-decoration: none;">
                      improtango.fi
                    </a>
                  </p>
                </td>
              </tr>               
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function newsletterWelcomeEmail(email?: string): string {
  const baseUrl = process.env.SITE_URL || 'https://improtango.fi';
  const unsubscribeUrl = email 
    ? `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`
    : `${baseUrl}/unsubscribe`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tervetuloa Improtangon uutiskirjeelle</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #020617;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020617;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0f172a; border-radius: 8px; overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #14b8a6; padding: 40px 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600;">
                    Improtango
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 40px 30px;">
                  <h2 style="margin: 0 0 20px; color: #f8fafc; font-size: 24px; font-weight: 600;">
                    Tervetuloa mukaan!
                  </h2>
                  <p style="margin: 0 0 16px; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                    Kiitos, että tilasit Improtangon uutiskirjeen.
                  </p>
                  <p style="margin: 0 0 16px; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                    Saat meiltä tietoa tulevista workshopeista, tapahtumista ja Improtangon maailmasta. Lähetämme uutiskirjettä muutaman kerran vuodessa – vain silloin kun meillä on todella jotain kerrottavaa.
                  </p>
                  <p style="margin: 24px 0 0;">
                    <a href="https://info.improtango.fi" style="display: inline-block; padding: 12px 24px; background-color: #14b8a6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
                      Tutustu Improtangoon
                    </a>
                  </p>
                </td>
              </tr>
              
              <!-- Divider -->
              <tr>
                <td style="padding: 0 40px;">
                  <div style="height: 1px; background-color: #1e293b;"></div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px 40px;">
                  <p style="margin: 0 0 12px; color: #94a3b8; font-size: 14px;">
                    Nähdään tanssissa,<br>
                    <span style="color: #f8fafc; font-weight: 600;">Minna Tuovinen & Martin Heslop</span>
                  </p>
                  <p style="margin: 20px 0 0; color: #64748b; font-size: 12px;">
                    <a href="https://info.improtango.fi" style="color: #14b8a6; text-decoration: none;">
                      info.improtango.fi
                    </a>
                    &nbsp;•&nbsp;
                    <a href="mailto:info@improtango.fi" style="color: #14b8a6; text-decoration: none;">
                      info@improtango.fi
                    </a>
                  </p>
                  <p style="margin: 15px 0 0; padding-top: 15px; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px; text-align: center;">
                    Et halua enää vastaanottaa uutiskirjettämme? 
                    <a href="${unsubscribeUrl}" style="color: #ef4444; text-decoration: none;">
                      Peruuta tilaus tästä
                    </a>
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function newsletterUnsubscribeNotification(email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .info { background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .label { font-weight: 600; color: #475569; }
        .value { color: #0f172a; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">Uutiskirjeen tilaus peruutettu</h2>
        </div>
        <div class="content">
          <p>Joku on peruuttanut uutiskirjeen tilauksen.</p>
          
          <div class="info">
            <div class="label">Sähköpostiosoite:</div>
            <div class="value">${email}</div>
          </div>
          
          <div class="info">
            <div class="label">Peruutusaika:</div>
            <div class="value">${new Date().toLocaleString('fi-FI')}</div>
          </div>
          
          <p style="margin-top: 20px; color: #64748b; font-size: 14px;">
            Tilaaja on poistettu automaattisesti tietokannasta.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function newsletterAdminNotification(email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #14b8a6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .info { background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .label { font-weight: 600; color: #475569; }
        .value { color: #0f172a; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0;">Uusi uutiskirjeen tilaus</h2>
        </div>
        <div class="content">
          <p>Joku on tilannut Improtangon uutiskirjeen verkkosivuilla.</p>
          
          <div class="info">
            <div class="label">Sähköpostiosoite:</div>
            <div class="value">${email}</div>
          </div>
          
          <div class="info">
            <div class="label">Tilausaika:</div>
            <div class="value">${new Date().toLocaleString('fi-FI')}</div>
          </div>
          
          <p style="margin-top: 20px; color: #64748b; font-size: 14px;">
            Voit tarkastella kaikkia tilauksia admin-paneelissa.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}