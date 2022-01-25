var db = new PouchDB('restaurants');
var stars;
var restaurantId = "";

function initializeDatabase() {
    var doc1 = {
        "_id": "1",
        "name": "Cake Factory",
        "rating": 4.8,
        "noOfRating": 225,
        "noOfRatingText": "200"
    };

    db.put(doc1)
        .catch(function (error) {
            return db.get(doc1._id);
        });

    var doc2 = {
        "_id": "2",
        "name": "The Goodies",
        "rating": 4.5,
        "noOfRating": 170,
        "noOfRatingText": "150"
    };

    db.put(doc2)
        .catch(function (error) {
            return db.get(doc2._id);
        });

    var doc3 = {
        "_id": "3",
        "name": "Butter Boutique",
        "rating": 0,
        "noOfRating": 0,
        "noOfRatingText": "0"
    };

    db.put(doc3)
        .catch(function (error) {
            return db.get(doc3._id);
        });

    var doc4 = {
        "_id": "4",
        "name": "Bakes by Bella",
        "rating": 4.7,
        "noOfRating": 335,
        "noOfRatingText": "150"
    };

    db.put(doc4)
        .catch(function (error) {
            return db.get(doc4._id);
        });

    for (let i = 1; i < 5; i++) {
        db.get(i.toString()).then(function (doc) {
            console.log(doc);
        });
    }
}

function fillStar(starId) {
    stars = starId;
    for (let i = 1; i <= starId; i++) {
        var id = '#star' + i;
        $(id).css('fill', '#00567B');
    }
    for (let i = starId + 1; i <= 5; i++) {
        var id = '#star' + i;
        $(id).css('fill', 'transparent');
    }
}

function resetStars() {
    stars = 0;
    for (let i = 1; i <= 5; i++) {
        var id = '#star' + i;
        $(id).css('fill', 'transparent');
    }
}

function closeRatingDialog() {
    resetStars()
    window.location.href = "#Home";
}

function addRating(restaurantId) {
    window.restaurantId = restaurantId;
    window.location.href = "#add-rating-dialog";
}

function calculateNoOfRatingText(newNoOfRating) {
    if (newNoOfRating < 50) {
        return newNoOfRating;
    } else {
        Math.floor(newNoOfRating / 50);
    }
}

async function addRatingToDatabase() {
    if (stars != 0) {
        await db.get(restaurantId).then(function (doc) {
            var newNoOfRating = doc.noOfRating + 1;
            var newNoOfRatingText = calculateNoOfRatingText(newNoOfRating);
            var newRating = (((doc.rating * doc.noOfRating) + stars) / newNoOfRating).toFixed(1);


            doc.noOfRating = newNoOfRating;
            doc.noOfRatingText = newNoOfRatingText;
            doc.rating = newRating;
            return db.put(doc);
        }).then(function () {
            return db.get(restaurantId);
        }).then(function (doc) {
            console.log(doc);
        });

        resetStars();
        window.location.href = "#rating-added-dialog";
    }
}

function readRatingToDesserts() {
    var spanTagId = ['.cake-factory-rating', '.the-goodies-rating', '.butter-boutique-rating', '.bakes-by-bella-rating'];

    for (let i = 1; i < 5; i++) {
        db.get(i.toString(), function (err, doc) {
            if (err) {
                return console.log(err);
            } else {
                if (doc.rating === 0) {
                    $(spanTagId[i - 1]).text('N/A');
                } else {
                    $(spanTagId[i - 1]).text(doc.rating);
                }
            }
        });
    }
}

function readRatingToRestaurant(restaurantId) {
    db.get(restaurantId, function (err, doc) {
        if (err) {
            return console.log(err);
        } else {
            if (doc.rating === 0) {
                rating = 'N/A'
            } else {
                rating = doc.rating;
            }

            if (doc.noOfRating <= 50) {
                rating += ' (' + doc.noOfRatingText + ' ratings)';
            } else {
                rating += ' (' + doc.noOfRatingText + '+ ratings)';
            }

            $('#restaurant-rating').text(rating);
        }
    });
}

function readRatingInfo(restaurantId) {
    db.get(restaurantId, function (err, doc) {
        if (err) {
            return console.log(err);
        } else {
            if (doc.rating === 0) {
                rating = 'N/A'
            } else {
                rating = doc.rating;
            }

            if (doc.rating > 0 && doc.noOfRating <= 50) {
                rating += ' (' + doc.noOfRatingText + ' ratings)';
            } else {
                rating += ' (' + doc.noOfRatingText + '+ ratings)';
            }

            $('#restaurant-info-rating').text(rating);
            var stars = doc.rating.toString().split(".")[0];
            fillStar(stars);
        }
    });
}

async function resetDatabase() {
    await db.destroy(function (err, response) {
        if (err) {
            return console.log(err);
        } else {
            console.log("Database deleted successfully.");
        }
    });
}

initializeDatabase();
readRatingToDesserts();
if (document.getElementById("restaurant-id") != null) {
    restaurantId = document.getElementById("restaurant-id").getAttribute("data-name");
    readRatingToRestaurant(restaurantId);
    readRatingInfo(restaurantId);
}
// resetDatabase();