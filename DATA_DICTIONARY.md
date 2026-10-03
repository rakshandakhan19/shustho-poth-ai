# Data dictionary

## local_language_dataset.csv
- `id`: unique synthetic example ID.
- `split`: train or held-out test.
- `text`: Bangla/Banglish user-style message.
- `intent`: target class.
- `predicted_intent`: model output (for evaluation rows).
- `correct`: whether prediction matched the target.
- `confidence`: prototype confidence score.

## facilities_dghs_sample.json
Fields mirror public DGHS Facility Registry concepts such as facility ID, English/Bangla name, type, agency, division, district and upazila. The six records are sample registry records retrieved from the public registry; they are not a complete facility database and do not provide live availability.
