let queryInput = '';

export const usStates = [
    { name: "ALABAMA", code: "AL" },
    { name: "ALASKA", code: "AK" },
    { name: "ARIZONA", code: "AZ" },
    { name: "ARKANSAS", code: "AR" },
    { name: "CALIFORNIA", code: "CA" },
    { name: "COLORADO", code: "CO" },
    { name: "CONNECTICUT", code: "CT" },
    { name: "DELAWARE", code: "DE" },
    { name: "FLORIDA", code: "FL" },
    { name: "GEORGIA", code: "GA" },
    { name: "HAWAII", code: "HI" },
    { name: "IDAHO", code: "ID" },
    { name: "ILLINOIS", code: "IL" },
    { name: "INDIANA", code: "IN" },
    { name: "IOWA", code: "IA" },
    { name: "KANSAS", code: "KS" },
    { name: "KENTUCKY", code: "KY" },
    { name: "LOUISIANA", code: "LA" },
    { name: "MAINE", code: "ME" },
    { name: "MARYLAND", code: "MD" },
    { name: "MASSACHUSETTS", code: "MA" },
    { name: "MICHIGAN", code: "MI" },
    { name: "MINNESOTA", code: "MN" },
    { name: "MISSISSIPPI", code: "MS" },
    { name: "MISSOURI", code: "MO" },
    { name: "MONTANA", code: "MT" },
    { name: "NEBRASKA", code: "NE" },
    { name: "NEVADA", code: "NV" },
    { name: "NEW HAMPSHIRE", code: "NH" },
    { name: "NEW JERSEY", code: "NJ" },
    { name: "NEW MEXICO", code: "NM" },
    { name: "NEW YORK", code: "NY" },
    { name: "NORTH CAROLINA", code: "NC" },
    { name: "NORTH DAKOTA", code: "ND" },
    { name: "OHIO", code: "OH" },
    { name: "OKLAHOMA", code: "OK" },
    { name: "OREGON", code: "OR" },
    { name: "PENNSYLVANIA", code: "PA" },
    { name: "RHODE ISLAND", code: "RI" },
    { name: "SOUTH CAROLINA", code: "SC" },
    { name: "SOUTH DAKOTA", code: "SD" },
    { name: "TENNESSEE", code: "TN" },
    { name: "TEXAS", code: "TX" },
    { name: "UTAH", code: "UT" },
    { name: "VERMONT", code: "VT" },
    { name: "VIRGINIA", code: "VA" },
    { name: "WASHINGTON", code: "WA" },
    { name: "WEST VIRGINIA", code: "WV" },
    { name: "WISCONSIN", code: "WI" },
    { name: "WYOMING", code: "WY" }
];
    


export async function validateSearchInput(query) {
    queryInput = query.toUpperCase();
    console.log(query.toUpperCase());

// to account for Kansas
    const exactMatch = usStates.find(state => state.name.toUpperCase() === queryInput);
    
    if (exactMatch) {
        console.log(exactMatch.name + ', ' + exactMatch.code);
        return exactMatch.code;
    }


    const matchingStates = usStates.filter(state => (
        state.name.toUpperCase().includes(queryInput) || state.code === queryInput));

    if (matchingStates.length > 0) {
        const matchingStateNames = matchingStates.map(state => state.name).join(', ');
        const matchingStateCodes = matchingStates.map(state => state.code).join(', ');

        console.log(matchingStateNames + ', ' + matchingStateCodes);
        return matchingStateCodes;
    } else {
        console.log('No matching states found');
        return '';
    }
}



