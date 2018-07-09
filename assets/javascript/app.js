
$(document).ready(function () {
    $("#allContent").hide();
    $(".editTrain").hide();
    var config = {
        apiKey: "AIzaSyC1dZQTG1WYJuKO3FZIo-7VgN0j7cpvV1w",
        authDomain: "train-activity-cfddd.firebaseapp.com",
        databaseURL: "https://train-activity-cfddd.firebaseio.com",
        projectId: "train-activity-cfddd",
        storageBucket: "",
        messagingSenderId: "985142778643"
    };
    firebase.initializeApp(config);


    var database = firebase.database();


    var trainName; 
    var destination; 
    var firstTrain; 

    var freqMin; ;
    var nextArrival = 0;
    var minutesAway = 0;
    var firstTrainTime = 0;
    var freqMinTime = 0;
    var b = moment();
    var trainId = "";
    console.log("current time:" + typeof (b))
    console.log("current time:" + typeof (bb))



    $("#submit-button").on("click", function () {
        event.preventDefault();


        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();

        firstTrainRaw = $("#firstTrain").val();

        firstTrain = parseInt(moment(firstTrainRaw, 'HH:mm A').format("x"));


        freqMinRaw = $("#freqMin").val();
        freqMin = parseInt($("#freqMin").val() * 60000);
        //////////////////////////
        if (trainName == "") {
            alert('Enter a train name');
            return false;
        }
        if (destination == "") {
            alert('Enter a destination.');
            return false;
        }
        if (firstTrainRaw == "") {
            alert('Enter a first train time');
            return false;
        }
        if (freqMinRaw == "") {
            alert('Enter a frequency');
            return false;
        }

        ///////////////////////////////////////
        database.ref("train-activity").push({
            TrainName: trainName,
            Destination: destination,
            FirstTrain: firstTrain,
            FreqMin: freqMin,
        });

        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrain").val("");
        $("#freqMin").val("");

    })



    //////////////////////////////////////////////
    var snapshot;
    var key;
    var trainData;
    var trainDataTotal = [];
    var keyId;
    
    database.ref("train-activity").on("child_added", function (snapshot) {

        trainData = snapshot.val();
        trainDataTotal.push(trainData)
        keyId = snapshot.key
        var TrainName = trainData.TrainName;
        var TrainDest = trainData.Destination;
        var FirstTrain = trainData.FirstTrain;
        var FreqMin = trainData.FreqMin;
        ///////////////////////////////////////

        //////Math Calculations////////////

        var a = FirstTrain;
        var b = parseInt(moment().format("x"));
        var c = FreqMin;
        var d = b - a; /// Total miliseconds between span 
        var e = Math.floor(d / c); /// Number of intervals in span 
        var f = d % c;///Remaining seconds of interval
        var nextArrival = ((e + 1) * c) + a;
        var timeAway = nextArrival - b;
        console.log(a, b, c, d, e, f, nextArrival, timeAway)
        /////////////////////////////////////

        /////////Parse to date and Time///////
        FirstTrain = moment(FirstTrain).format("hh:mm a");
        FreqMin = FreqMin / 60000;
        NextArrival = moment(nextArrival).format("hh:mm a");
        TimeAway = Math.floor(timeAway / 60000);

        if (TimeAway < 1) {
            TimeAway = "Due"
        }


        rowMaker(TrainName, TrainDest, FirstTrain, FreqMin, NextArrival, TimeAway,keyId);

    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });


    //////////////////////////remove button////////////

    $(document).on("click", ".delete", function () {

        console.log("hi")

        var confirmation = prompt("Are you sure you want to delete this record?(Y/N)", "N");


        if (confirmation == "Y" || confirmation == "y") {

            var keyDel = $(this).attr("key");


            database.ref("train-activity").child(keyDel).remove();
            $(this).parents("tr").remove();

        }

    })

    //////////////////////////////////////////////////////


    ////////////////////Edit Button/////////////////////

    var indexEdit;
    $(document).on("click", ".edit", function () {
        //Gets "key" attribute of button which is trains "key";
        keyEdit = $(this).attr("key");
        console.log("key edit" + keyEdit)
        indexEdit = $(this).parents("tr").index();
        console.log("index:" + $(this).parents("tr").index())
        editSection();

    });


    function editSection() {
        $(".editTrain").show();
        $(".addTrain").hide();

        $("#editTrainName").val(trainDataTotal[indexEdit].TrainName);
        $("#editDestination").val(trainDataTotal[indexEdit].Destination);
        var editFirstTrain = moment(trainDataTotal[indexEdit].FirstTrain).format('HH:mm')
        console.log("time format:" + editFirstTrain)
        $("#editFirstTrain").val(editFirstTrain);

        $("#editFreqMin").val((trainDataTotal[indexEdit].FreqMin) / 60000);


    }

    $("#update-button").on("click", function () {
        event.preventDefault();

        trainUpdate();

    });


    function trainUpdate() {

        trainName = $("#editTrainName").val().trim();
        destination = $("#editDestination").val().trim();
        firstTrainRaw = $("#editFirstTrain").val();
        firstTrain = parseInt(moment(firstTrainRaw, 'HH:mm A').format("x"));
        freqMinRaw = $("#editFreqMin").val();
        freqMin = parseInt($("#editFreqMin").val() * 60000);
        //////////////////////////
        if (trainName == "") {
            alert('Enter a train name');
            return false;
        }
        if (destination == "") {
            alert('Enter a destination.');
            return false;
        }
        if (firstTrainRaw == "") {
            alert('Enter a first train time');
            return false;
        }
        if (freqMinRaw == "") {
            alert('Enter a frequency');
            return false;
        }

        ///////////////////////////////////////

        var TrainName;
        var Destination;
        var FirstTrain;
        var FreqMin;
        ///////////////////////////////////////
            var editedField = database.ref("train-activity" + "/" + keyEdit)
            console.log("editedField" + editedField)
            
            editedField.update({
                TrainName: trainName,
                Destination: destination,
                FirstTrain: firstTrain,
                FreqMin: freqMin,
                  
            })

            
            console.log("key Edit:"+keyEdit)
           
        $(".editTrain").hide();
        $(".addTrain").show();

    
}

    //////////cancel button//////////////

    $("#cancel-button").on("click", function () {
        event.preventDefault();


        $(".editTrain").hide();

        $(".addTrain").show();

    });


    ////////////////////////////////////



    rowMaker = function (a, b, c, d, e, f,keyId) {
        var tBody = $("tbody");
        var tRow = $("<tr>");
        tRow.addClass(keyId)
        var TrainNameID = $("<td>").text(a);
        var TrainDestID = $("<td>").text(b);
        var FirstTrainID = $("<td>").text(c);
        var FreqMinID = $("<td>").text(d);
        var NextArrivalID = $("<td>").text(e);
        var TimeAwayID = $("<td>").text(f);

        var editIcon = $("<td class='edit'><span class='glyphicon glyphicon-edit pop'></span>")
        $(editIcon).attr({
            "key": keyId,
            "data-toggle": "tooltip",
            "data-placement": "left",
            "title": "Edit"

        })


        var deleteIcon = $("<td class='delete'><span class='glyphicon glyphicon-trash pop'></span>")
        $(deleteIcon).attr({
            "key": keyId,
            "data-toggle": "tooltip",
            "data-placement": "left",
            "title": "Delete"

        })

        tRow.append(TrainNameID, TrainDestID, FirstTrainID, FreqMinID, NextArrivalID, TimeAwayID, editIcon, deleteIcon);
        tBody.append(tRow);


    };



    /////////////Current Date///////////

    function displayRealTime() {
        setInterval(function () {
            $('#current-time').html(moment().format('D. MMMM YYYY'))
        }, 1000);
    }
    displayRealTime();


        ////////////////clock////////////////

    function updateClock() {
        var now = moment(),
            second = now.seconds() * 6,
            minute = now.minutes() * 6 + second / 60,
            hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;

        $('#hour').css("transform", "rotate(" + hour + "deg)");
        $('#minute').css("transform", "rotate(" + minute + "deg)");
        $('#second').css("transform", "rotate(" + second + "deg)");
    }

    function timedUpdate() {
        updateClock();
        setTimeout(timedUpdate, 1000);
    }

    timedUpdate();



    /////////////////////////////////////////
    ///////////sign In-Sign Out part//////////////
    var user;
    var userName;
    var userEmail;
    var userPhoto = "";
    var userId;

    var provider = new firebase.auth.GoogleAuthProvider();

    //////////////sign out//////////////

    $("#signOut-button").on("click", function () {
        event.preventDefault();

        console.log("hi")
        console.log(provider)


        firebase.auth().signOut().then(function () {

            $("#allContent").hide();
            $("#signIn").show();

            removeUserData(userId);

        }).catch(function (error) {

        });



    });
    /////////////////////////////////////



    ///////////////sign In//////////////////
    $("#signIn-button").on("click", function () {
        event.preventDefault();

        console.log("hi")
        console.log(provider)



        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            user = result.user;
            userName = user.displayName
            console.log("userName: " + userName)
            userEmail = user.email
            console.log("userEmail: " + userEmail)
            userPhoto = user.photoURL;
            console.log("userPhoto: " + userPhoto)
            userId = user.uid
            console.log("userId: " + userId)

            $("#signIn").hide();

            $("#allContent").show();

            $("#welcomeMsg").html(" " + userName)
            $(".card-img-top").attr("src", userPhoto)
            writeUserData(userName, userEmail, userPhoto, userId)



            // ...
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });

    });





    /////////////////add user data//////////////////

    function writeUserData(name, email, imageUrl, userId) {
        firebase.database().ref('Users/' + user.uid).set({
            username: name,
            email: email,
            profile_picture: imageUrl,
            userId: userId
        });
    }

    ////////////////////////////


    ///////////Remove User Data/////////////////////
    function removeUserData(userId) {
        //    
        firebase.database().ref('Users/').child(userId).remove();

    };

    /////////////end of document ready/////////////////////
})