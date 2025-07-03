from fastapi import FastAPI
import gspread
from oauth2client.service_account import ServiceAccountCredentials

app = FastAPI()

scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)

SHEET_NAME = "WVSU Opportunities APP"
sheet = client.open(SHEET_NAME).worksheet("opportunities")

@app.get("/opportunities")
def get_opportunities():
    records = sheet.get_all_records()
    return {"opportunities": records}