class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
        this.engine.inventory = [];
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];

        //console.log(Object.keys(this.engine.inventory));

        if ("Requirements" in locationData) {
            let has_requirements = true;
            //console.log(typeof locationData.Requirements);
            for (let requirement of locationData.Requirements) {
                if (!(requirement.Key in this.engine.inventory)) {
                    this.engine.show(requirement.Prompt);
                    has_requirements = false;
                }
            }

            if (!has_requirements) {
                this.engine.addChoice(locationData.Back.Text, locationData.Back);
                return;
            }
        }

        this.engine.show(locationData.Body);

        if("Choices" in locationData && locationData.Choices.length !== 0) {
            for(let choice of locationData.Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        //console.log(choice);
        if(choice) {
            this.engine.show("&gt; "+choice.Text);

            if ("Items" in choice) {
                for (let item of choice.Items) {
                    this.engine.inventory[item] = true;
                }
            }

            if ("Action" in choice) {
                this.engine.show(choice.Prompt);
                return;
            }

            //console.log(this.engine.storyData.Locations[choice.Target]);
            if ("SpecialLocation" in this.engine.storyData.Locations[choice.Target]) {
                console.log(this.engine.storyData.Locations[choice.Target].SpecialLocation);
                this.engine.gotoScene(this.engine.storyData.Locations[choice.Target].SpecialLocation, choice.Target);
            }
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class LocationWithAction extends Location {
    create(key) {
        super.create(key);

        let locationData = this.engine.storyData.Locations[key];

        for (let action of locationData.Actions)  {
            this.engine.addChoice(action.Text, action);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');