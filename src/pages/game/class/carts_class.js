class Cartas{
    //misCartas[0]=infanteria; [1]=caballeria; [2]=artilleria
     Cartas(){
        misCartas = new int[3];
        for(var i = 0; i < 3; i++){
            misCartas[i] = 0;
        }
    }

     Cartas(n1, n2, n3){
        misCartas = new int[3];
        misCartas[0] = n1;
        misCartas[1] = n2;
        misCartas[2] = n3;
    }


    // Devuelve el tipo de la nueva carta
    nuevaCarta(){
        tipoCarta = Random.Range(0,3);
        misCartas[tipoCarta]++;
        return tipoCarta;
    }

    puedoUsarCartas(){
        posiblesCartas = getCardsToUse();
        for(var i= 0; i < 3; i++){
            if (misCartas[i] != 0){
                return true;
            }
        }
        return false;
    }
    // Devuelve las cartas usadas
      usarCartas(){
      cartas = getCardsToUse();
        if(puedoUsarCartas()){
            for( var i=0; i<3; i++){
                misCartas[i] -= cartas.misCartas[i];
            }
        }
        else{
            console.Log("error cartas");
        }
        return cartas;

    }
    getCardsToUse(){
        if (misCartas[0]>=3){
            return new Cartas(3,0,0);
        }

        if (misCartas[1]>=3){
            return new Cartas(3,0,0);
        }

        if (misCartas[2]>=3){
            return new Cartas(3,0,0);
        }

        if (misCartas[0] > 0 && misCartas[1] > 0 && misCartas[2] > 0){
            return new Cartas(1,1,1);
        }

        return new Cartas();
    }
}