import { google } from "googleapis"

import fs from "fs"

import parseSheetData from "../utils/parseSheetData.js"

class Sheets {
  constructor(brand) {
    const credentials = {
      HPAL: {
        spreadsheetId: "1NvQpB2QdQHoNfk8JbLMv8NrLIKr_1VngzrDobWi8tlc",
        type: "service_account",
        project_id: "studious-karma-439813-n7",
        private_key_id: "503c69d9802bb5e93b1948b26a575ce310759cb4",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCyAAd4vzpPGsAr\npR1QkWaUi/ZQ3oWlARdkFtZCP3U5RbTqWTPABB/U5n8RZ90n6Ksl8YpqjKB6J+4s\nyjrntEG4NppdYFKFUC2ny+UvyrDdVdAdSGDj89q4g1dRZ034oPOCfIWfou+iJW18\nvsZzXe4flFw4+qZu+CjBrWSLURDypu8VndGTptA95lo4kvkXWtd/8JxlMHVzh2bY\nvlvNvZapM0Nq1/1szL98IU7sl8ooCJlpXtcYA0i8BTsC/q6wq+MJnopfTxLzGv0V\n1i8PYpw9gBU0wbUzLmoiPedfcma2YeV1xhr2ua4Z+GUEgT2jACuhDyhwUnFgDlvN\nDS0Uh2LjAgMBAAECggEADfhJndToRyAS1/oP+GxI8Dyh2sv0EjSpOM5AB5gCY7nQ\nTposoRPRybxDWcLcjQ7KK+KumdkqmRu8KiC/CcNQaxxB9jUilNrrkmFCvgL66Ywc\nFshA7nMLhfKs7jMc3/gF1IZgWFyJ0SB93M3+Njy3fRwANuqZGFl6nWS14Oc+XMTS\nudfCGs9hd1+zDxyZo7nynn6IRQJyDeRhCQ2Jj8ZZJ4hRI8qyWckn0iY9VzQLw1k4\nDIZNmEnXxO8N3CEK88bYzdLM41Wdml9AT3b41zR4/I5nt7ZtAnzwQB0S5tneViqK\nlr27X1pUbjmgdDq1xQKgDmbpyafUYuZs1WvGj/Rc+QKBgQDWjmFiVnTwCm+9wNqd\nfIbxquzAvnTdvjj79FvzHJ1azTB0/rc+nGupYbDk2GJAC2+5FFZY3Gw+5lMj3WVJ\naehI5TDo2v3/Q3dl3OXx25+cRsSUf/MX1kaX7s73fPwy2d338AjJX9GVpPQCJYRN\nmtZH8TlHIIJWBrgu+dzwieLTaQKBgQDUYfucFG7B7WBw+gn+3Tf4n61kRarkHZse\nfwVhVcZTNU10gTB9sFN38GEPcqGlHjc0aLmmJR8JTGJ9t4jEkrNZAfsrs2zgnv9o\n/6/k5g1/k54mF19dPI5+geguBzRe0AD9tYEW55OFAZG0IVmpfqALNEEUIAbBAI21\nYYE3NF4WawKBgGYNKvzfKpfSHvwect1dkcH5DstOy7987xXIUMP95EqANoAvd3Fs\nbTkPolf3JCRaTDW4GqoBjesNGpaAg+C7YyTo/q6DGzUDHhNxUl4LnIt0jaQkh7fa\nz5EMoZzN8hct0YpQvZ0q2kFXSEiNF7Th5PIrJpdSOyw33ftaFWDD9QOhAoGAMDvg\njN4HGXvzvzTKOFu9bnW1R2SbHxuqMw7eBfEZDaS5ZpBAlwsIqeCp6nw6QenO19RA\n9X7QwafbZnncUeiPWtOcW5xwScNSdmI7bFzjC+pWrIf6XI54Pjr6pBl2x2GuF/C0\n1KLbWgW1NZetaVUcu+6uKQftAMBDbsIqOoNmKukCgYB0KkOCe/4mJ+DujHthxCpS\nKOgYbzmdsOzlasLmLwFFh2jG2odmU7SJytrq818nDjUS+JAAc+G3UX44l2WvTnqV\nvH9qKmOPQWrYS2r24+82oWeQV+dOOkhtibEgw6sUTG4BqFytqRhKAYjtZJdKXgsV\nwI/QA5uTS3Ig8PpiEScdGA==\n-----END PRIVATE KEY-----\n",
        client_email: "transmarco@studious-karma-439813-n7.iam.gserviceaccount.com",
        client_id: "113308231215563709252",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/transmarco%40studious-karma-439813-n7.iam.gserviceaccount.com",
        universe_domain: "googleapis.com",
      },
      HPAM: {
        spreadsheetId: "1zhtgeitq_yjFx78IXRrHZVDDS7TQb8YuqMMT-MwHkZw",
        type: "service_account",
        project_id: "transmarco-482613",
        private_key_id: "a4bb8dd792bd70b5089ac0e7f1407ecc37d33754",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCfV1pU3aanTswO\ng0DODa04rSj95eOsx/Xay/XcmdTOWbG2lsEH0wmuBZ4YOgn5thdGw/pDF/QZ3Vcv\nHMAk0n/dakE5ejZNfrGmaAsWxvy0yeD9kwCvQ5HLPGKe0fJmtqBc40MhT9TuF477\n6BCt9kzb//araKnX5wWnvo1gizGY6TuMSuYsM4nM5nud/daybcuzvyvkEQvLNDTO\nzEcdPBUwGw4aEkOw+EKsNd5vjOCs/0gUp3vXGF51v4BMRLe6+bLoxggZzPZckKfy\n2mJV1WpU7K3iHVmVmpAP1pV0o8AxBzG4ZcC+houIL8HovSQuWK6JFfGcjdlplrz6\nKBqy5x9lAgMBAAECggEABlV1e965sEUQe6bNAMPVAsxwG80zffVCErOKPBdWhbaI\n1JsgF8lt3sYbZDDxn5FhuHuznk7v8mB0uQszOhauykreExGGe6seSnqW4kEAeS4P\n+WE9pQar33PKVpZxRJL2EFGT8NmL1Pdu+BisvQ8hPAEfOYepPktRIFT4D4JI81NW\nBnls8gwCFIAv2DWwZAv284xI4jBMGMZkH8TqPKM6o+gFZlMM5ZSY4Vo+VCKwOjx6\n7KMc4F1ItNEt2eLjTygSnwvgMQ/dlxnuWeqw6vg2ZypS3y5YXbxbUkP6d+WIW1VS\n4j6u/ZNAMSO8kXeUFMP8J6jUC6YubgWI8/sZHBIHMQKBgQDQPmy6tw7qX/aBDyl1\n7YSf9KrMtZo24QSQK3wFhnisAu9csFeGARnlMsOETdpo8XAesdutZW6TXDbB3DA5\nu7Xhl88A5sO1Hv7z217vjvmFr+jlEg2NApEcjhiFOXdWFsTxyxBLFyiko8qkjbWA\n7+92K+m1Iz5+2rjnd1sBgy0zOQKBgQDD4fQzHY0C0tNjTY5hj8gBXyVjjBi4mzVr\n4b1klkuD6XKX5eCXjkBfWLD9jf9bWac9y23XKaVdQ731pgug93ROPlVfSypTtV3V\nAc9OudDSKZOlcgHKisUwJrTNm3yTrvYFXKpt2vQwBlWO1gS5Y6X80YtZn2Lw1xj5\ng9uBadQxjQKBgCCGX30aMl4w9tNZhuRAYMKK+FJY2ulPY+MQp6JFSnuzSad0c3ce\nnOjLcPYtIrvZWeWxado/SXICqRrGRVH/G31MtKwzXsXfPXrg/Ib2EcrrmriMhUlM\n6VVIbFQCkb0EeWY6jSTtTQ/J9VCWQY8N6pzOZwY/pvcxOkgMwE4QKvMhAoGBAIh8\ny+xF/fhmsHZ0Fu6yAdm601GOz7bqJwoZzB7nfozWwEtJGPphW0dUhFbYd4LOcHLl\naY7P7PKUfitJXLb3VaojUtdIh6C2MkB2t12SqgeWgtN4IflgQk/v2HGfkulQswo/\nbF2JgDZqY3lYdQg8f+8ujxuOrKFGL5fEodGFzR4NAoGAUA00NZ+651xb1Mcqr7ee\nFMvFIlYuQEKzTn9Lyv30cNVSvmrACr4ugotCo9WnwAcyalyZqleJ035CGR4Rl9Gg\nZN6tKB88+4VEtkS49jLMHuveMTxtf+qg9Wc9W11HwXhBdpUEk6N7A9yftjzty9Kw\nmd0n/ymojjWg5UsfO/qjWCg=\n-----END PRIVATE KEY-----\n",
        client_email: "transmarco-831@transmarco-482613.iam.gserviceaccount.com",
        client_id: "105534025070186600808",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/transmarco-831%40transmarco-482613.iam.gserviceaccount.com",
        universe_domain: "googleapis.com",
      },
    }

    this.brand = brand
    this.spreadsheetId = credentials[brand].spreadsheetId

    this.sheets = google.sheets({ version: "v4", auth: new google.auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/spreadsheets"], credentials: credentials[brand] }) })
  }

  async get(range) {
    const { sheets, spreadsheetId } = this
    const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range, majorDimension: "ROWS" })

    return data
  }

  async getStock() {
    const { sheets, spreadsheetId, brand } = this

    const range = "STOCK!A1:CQ1000"
    const majorDimension = "ROWS"

    const { data } = await sheets.spreadsheets.values.get({ spreadsheetId, range, majorDimension })

    const rows = data.values.filter((x) => x[0] && x[0].length > 7)

    const charts = ["S", "M", "L", "XL", "XXL", "XXXL", "26", "28", "30", "32", "34", "36", "38", "TTL"]

    const map = [
      { range: "A:A", key: "artikel", int: false, stock: false },
      { range: "B:B", key: "desc", int: false, stock: false },
      { range: "C:P", key: "stock", int: true, stock: true },
      { range: "Q:AD", key: "sales", int: true, stock: true },
      { range: "AE:AR", key: "incoming", int: true, stock: true },
      { range: "AS:BF", key: "outgoing", int: true, stock: true },
      { range: "BG:BT", key: "ecomm", int: true, stock: true },
      { range: "BU:CH", key: "inventory", int: true, stock: true },
      { range: "CI:CI", key: "reff_code", int: false, stock: false },
      { range: "CJ:CJ", key: "shopee_id", int: false, stock: false },
      { range: "CJ:CJ", key: "squ_qty", int: false, stock: false },
      { range: "CL:CL", key: "code", int: false, stock: false },
      { range: "CM:CM", key: "sku", int: false, stock: false },
      { range: "CN:CN", key: "price", int: true, stock: false },
      { range: "CO:CO", key: "disc", int: false, stock: false },
      { range: "CP:CP", key: "netto", int: true, stock: false },
      { range: "CQ:CQ", key: "promo", int: false, stock: false },
    ]

    return parseSheetData(rows, map, charts, brand)
  }

  async append() {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:B",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [["6", "g"]],
      },
    })
  }
}

export default Sheets
