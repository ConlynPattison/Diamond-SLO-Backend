import express from "express";
import "dotenv/config";
import * as XLSX from "xlsx";
import * as path from "path";

const app = express();
const port = process.env.SERVER_PORT;

// TODO: Fetch the data from Excel file and format it into typed objects
// TODO: Have Express serve a basic homepage that will help Marci upload, delete, and download existing Excel files
// TODO: Frontend - have the students select the survey years

/**
 * Represents a complete data entry for one survery submission
 * @todo Add a field that more quickly determines the student year (freshman, sophomore, etc.)
 */
type SurveryResult = {
	timeStamp: Date;
	emailAddress: string;
	responses: [SurveyResponse];
};

/**
 * Represents one question and the related answer from a survey submission
 */
type SurveyResponse = {
	question: string;
	answer: string | number;
};

/**
 * Fetches local xlsx file's sheet data and returns it as json.
 * Not friendly on memory as column name (question) included with each property.
 */
const getSheetJSON = (dirname: string, xlsxPath: string) => {
	const workbook = XLSX.readFile(path.resolve(dirname, xlsxPath))
	const sheetName = workbook.SheetNames[0];
	const worksheet = workbook.Sheets[sheetName];

	return XLSX.utils.sheet_to_json(worksheet);;
}

app.get("/", (req, res) => {
	res.send("hello world");
});

// Use to serve dummy data up to the React client
app.get("/api/dummy", (req, res) => {
	const result: SurveryResult = {
		timeStamp: new Date("1/17/2024 8:54:34"),
		emailAddress: "700155@pvusd.net",
		responses: [
			{
				question:
					"Applying industry-standard technology, programs, and equipment to create a product",
				answer: 10,
			},
		],
	};

	res.status(200).type("json").json(result);
});


app.get("/api/dummy1", async (req, res) => {
	const json = getSheetJSON(__dirname, "../data/test.xlsx")

	res.status(200).json(json)
})

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});
