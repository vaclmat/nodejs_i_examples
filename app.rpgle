         // CRTDTAQ DTAQ(QGPL/QREQFI2) MAXLEN(256)
         // CRTBNDRPG PGM(CZ50247/APP) +
         //SRCSTMF('/QOpenSys/QIBM/UserData/OPS/Orion/ +
         //serverworkspace/cz/cz50247/OrionContent/Node_v6/app.rpgle') 

        ctl-opt main(main) dft
        dcl-proc main;
          dcl-pi *N extpgm; 
             input_value char(20) const;
          end-pi;
          snddtaq('QREQFI2': 'QGPL': 20: input_value);
        end-proc;actgrp(*no);

        dcl-pr snddtaq extpgm('QSNDDTAQ');
         dtqname   char(10)    const;
         dtqlib    char(10)    const;
         dtqlength packed(05)  const;
         dtqdata   char(32766) const options(*varsize);
        end-pr;
