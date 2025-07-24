## Welcome to Find Falcone Game!
Our problem is set in the planet of Lengaburu…in the distant galaxy of Tara B. After the recent war with neighbouring planet Falicornia, King Shan has exiled the Queen of Falicorniafor 15 years.
Queen Al Falcone is now in hiding. But if King Shan can ﬁnd her before the years are up, she will be exiled for another 15 years….

King Shan has received intelligence that Al Falcone is in hiding in one of these 6 planets - DonLon, Enchai, Jebing,Sapir, Lerbin & Pingasor. However he has limited resources at his disposal & can send his army to only 4 of these planets.
Your coding problem is to help King Shan ﬁnd Al Falcone.


## Understanding Game UI:
 - When you start playing the game, you will see 4 dropdowns(Destinations) for selecting planets from total 6 planets.
 - One planet can be selected only once.
 - After selecting a planet you will get list of available vehicles(in radio input) that can reach that particular selected planet.
 - Depending upon the maximum range of each vehicle and it's count, the input will be enabled or disabled.
 - After selecting a vehicle, time taken to reach there will be automatically displayed, similarly for each planet the total time will be calculated.
 - You will see all your selections like destination planet,vehicle chosen and time taken to reach there, in a list format.
 - When all 4 planets are selected with vehicles then you can start finding falcone by hitting the find falcone button.
 - You can see the result as success with planet name(where falcone is) if you are able to find falcone and failure if not found.
 - Finding the falcone is purely based on LUCK so keep trying even if you are unable to find it intially.
 - Enjoy the Game!

## My thought process to code this game:

 - Firstly I thought of implementing this game using vanilla JS to keep things simple!
 - After understanding the problem statement, i decided to go with simple UI having dropdown,radio inputs and a button.
 - I started with implementing the core logic then testing it accordingly.
 - Implementing core game logic:
    - write basic HTML and CSS for setting up initial UI.
    - fetch planet and vehicle data from API
    - render 4 dropdowns with planet data
    - make sure that single planet is only selected once out of 4 dropdowns.
    - maintain two global arrays to store selected planets and selected vehicles.
    - after making planet selection,show list of available vehicles that can reach that selected planet.
    - select any one vehicle and calculate time to reach there.
    - follow the same logic for all dropdowns and calculate total time by adding all 4 times.
    - maintian a selections array to store all destinations,vehicles and time.
    - display it accordingly after selecting a planet and a vehicle.
    - hit find falcone button which will make POST request to two API's.
    - first one is for getting token and second one is for getting result of finding falcone.
    - send only header body in first post request and get token.
    - send header and request body with selected vehicles and selected planets to get final result.
    - display final result as success or failure.
- Add routing to game.
    - home page,main page and result page.
    - click on start game and navigate to main page.
    - click on find falcone and navigate to result page.

### Future Enhancements
- Improve the UI because currently it is very basic.
- Try to code the same problem using REACT library.


### Links

- Git hub Repo URL: [https://github.com/mike15395/finding-falcone-challenge]
- Live Site URL: [https://finding-falcone-challenge.vercel.app/]
 
### Author
- Mikhil Desai 
